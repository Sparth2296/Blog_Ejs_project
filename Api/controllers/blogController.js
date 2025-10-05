const Blog = require('../models/BlogModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Multer setup for image storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// 🧩 Controller functions

// Add new blog
const addBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    await Blog.create({ title, content, author, image });
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error creating blog');
  }
};

// Edit blog
const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).send('Blog not found');

    if (req.file) {
      if (blog.image && fs.existsSync(path.join(__dirname, '..', blog.image))) {
        fs.unlinkSync(path.join(__dirname, '..', blog.image));
      }
      blog.image = `/uploads/${req.file.filename}`;
    }

    blog.title = title;
    blog.content = content;
    await blog.save();
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error updating blog');
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (blog.image && fs.existsSync(path.join(__dirname, '..', blog.image))) {
      fs.unlinkSync(path.join(__dirname, '..', blog.image));
    }

    await Blog.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting blog');
  }
};

// Get all blogs
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('home', { blogs });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching blogs');
  }
};

// View single blog
const viewBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.render('viewBlog', { blog });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error fetching blog');
  }
};

module.exports = { upload, addBlog, editBlog, deleteBlog, getBlogs, viewBlog };
