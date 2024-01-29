const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Model/User.Model");
const { BlacklistModel } = require("../Model/BlackList.Model");
const { auth } = require("../Middlewares/Auth.middleware");
const cookieParser = require("cookie-parser");
const userRouter = express.Router();
const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The user name
 *         email:
 *           type: string
 *           description: The user email
 *         pass:
 *           type: string
 *           description: The user password
 */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: All the API routes related to User
 */
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: This will create a new user in the database
 *     tags:
 *       - User
 *     requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: For creating a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               item:
 *                 $ref: "#/components/schemas/User"
 */

userRouter.use(cookieParser());
userRouter.post("/register", async (req, res) => {
  try {
    const { pass } = req.body;
    bcrypt.hash(pass, 5, async function (err, hash) {
      if (err) {
        res.status(400).send({ msg: err.message });
      } else {
        const user = new UserModel({ ...req.body, pass: hash });
        await user.save();
        res.status(200).send({ msg: `user created successfully` });
      }
    });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: This will validate the user
 *     tags:
 *       - User
 *     requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: For authenticating the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               item:
 *                 $ref: "#/components/schemas/User"
 */
userRouter.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, function (err, result) {
        if (result) {
          var accessToken = jwt.sign(
            { userId: user._id, username: user.username },
            accessTokenKey,
            {
              expiresIn: "1h",
            }
          );
          var refreshToken = jwt.sign(
            { userId: user._id, username: user.username },
            refreshTokenKey,
            {
              expiresIn: "1d",
            }
          );
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          });
          res.status(200).send({ msg: "Login Successful" });
        } else {
          res.status(400).send({ msg: "Wrong Password" });
        }
      });
    } else {
      res.status(400).send({ msg: "user not found" });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});
/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: This will logout the user
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating successful logout
 */

userRouter.get("/logout", auth, async (req, res) => {
  try {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];
    const blacklist = new BlacklistModel({
      accessToken,
      refreshToken,
    });
    await blacklist.save();
    res.status(200).send({ msg: `Logged out successfully` });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = { userRouter };
