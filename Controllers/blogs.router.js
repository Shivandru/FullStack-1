const express = require("express");
const { BlogModel } = require("../Model/Blogs.Model");
const blogRouter = express.Router();
const { auth } = require("../Middlewares/Auth.middleware");
blogRouter.use(auth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         title:
 *           type: string
 *           description: Title of the Blog
 *         body:
 *           type: string
 *           description: Description of the Blog
 *         userId:
 *           type: string
 *           description: The Id of the user who created the blog
 *         username:
 *           type: string
 *           description: The name of the user who created the blog
 */
/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: All the API routes related to Blogs
 */
/**
 * @swagger
 * /blog:
 *   get:
 *     summary: This will get all the blogs from the database
 *     tags:
 *       - Blog
 *     responses:
 *       200:
 *         description: Will get all the blogs from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               item:
 *                 $ref: "#/components/schemas/Blog"
 */

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.status(200).send({ msg: "All blogs", data: blogs });
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});
/**
 * @swagger
 * /blog/add:
 *   post:
 *     summary: This will create a new blog in the database
 *     tags:
 *       - Blog
 *     requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/Blog"
 *     responses:
 *       200:
 *         description: Will create a new blog in the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               item:
 *                 $ref: "#/components/schemas/Blog"
 */
blogRouter.post("/add", async (req, res) => {
  try {
    let userId = req.userId;
    let username = req.username;
    const blog = new BlogModel({ ...req.body, userId, username });
    await blog.save();
    res.status(200).send({ msg: "Blog added successfully" });
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});

blogRouter.patch("/update/:blog_id", async (req, res) => {
  try {
    const { blog_id } = req.params;
    const userId = req.userId;
    const blog = await BlogModel.findOne({ _id: blog_id });
    if (blog.userId === userId) {
      await BlogModel.findByIdAndUpdate({ _id: blog_id }, req.body);
      res.status(200).send({ msg: "Blog updated successfully" });
    } else {
      res
        .status(200)
        .send({ msg: `You are not authorized to update this blog` });
    }
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});
blogRouter.delete("/delete/:blog_id", async (req, res) => {
  try {
    const { blog_id } = req.params;
    const userId = req.userId;
    const blog = await BlogModel.findOne({ _id: blog_id });
    if (userId === blog.userId) {
      await BlogModel.findByIdAndDelete({ _id: blog_id });
      res.status(200).send({ msg: "Blog deleted successfully" });
    } else {
      res
        .status(200)
        .send({ msg: `You are not authorized to delete this blog` });
    }
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});

module.exports = { blogRouter };
