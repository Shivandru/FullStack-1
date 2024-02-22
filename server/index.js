const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connection } = require("./Database/db");
const { userRouter } = require("./Controllers/user.routes");
const { recordRouter } = require("./Controllers/record.router");
const Port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
    httpOnly: true,
  })
);
app.use("/user", userRouter);
app.use("/record", recordRouter);
app.get("/", (req, res) => {
  res.status(200).send(`<h2>Welcome to my EHR Website...</h2>`);
});
app.listen(Port, async () => {
  try {
    await connection;
    console.log(`server is running on port ${Port} and Mongo Connected...`);
  } catch (error) {
    console.log(error);
  }
});
