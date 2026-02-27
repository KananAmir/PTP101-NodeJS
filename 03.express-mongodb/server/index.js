const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening on port ${port}, link: http://localhost:${port}`,
  );
});

//Model for Blog

const Schema = mongoose.Schema;
const blogSchema = new Schema({
  title: String,
  category: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json({
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error) {
    res.json({ message: "Error fetching blogs", error });
  }
});

const DB_URL =
  "mongodb+srv://ptp101dev:ptp101dev@cluster0.7ge7nhr.mongodb.net/BlogApp";

mongoose
  .connect(DB_URL)
  .then(() => console.log("Connected!"))
  .catch((err) => console.log(err));
