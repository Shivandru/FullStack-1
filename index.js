const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connection } = require("./Database/db");
const { userRouter } = require("./Controllers/user.routes");
const { blogRouter } = require("./Controllers/blogs.router");
const Port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
    credentials: true,
    httpOnly: true,
  })
);
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.listen(Port, async () => {
  try {
    await connection;
    console.log(`server is running on port ${Port} and Mongo Connected...`);
  } catch (error) {
    console.log(error);
  }
});
