const accessTokenKey = process.env.ACCESS_TOKEN_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
const { BlacklistModel } = require("../Model/BlackList.Model");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];
  try {
    const blacklistToken = await BlacklistModel.findOne({
      accessToken: accessToken,
    });
    if (!blacklistToken) {
      jwt.verify(accessToken, accessTokenKey, function (err, decoded) {
        console.log(decoded);
        if (err) {
          jwt.verify(refreshToken, refreshTokenKey, function (err, decoded) {
            if (decoded) {
              var newToken = jwt.sign(
                {
                  userId: decoded.userId,
                  username: decoded.username,
                  role: decoded.role,
                },
                accessTokenKey,
                { expiresIn: "1h" }
              );
              res.cookie("accessToken", newToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
              });
              req.userId = decoded.userId;
              req.username = decoded.username;
              req.role = decoded.role;
              next();
            } else {
              res.status(400).send({ msg: `Please Login Again` });
            }
          });
        } else if (decoded) {
          req.userId = decoded.userId;
          req.username = decoded.username;
          req.role = decoded.role;
          next();
        } else {
          res.status(404).send({ msg: "Please Login Again" });
        }
      });
    } else {
      res.status(400).send({ msg: `Please Login Again` });
    }
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
};

module.exports = { auth };
