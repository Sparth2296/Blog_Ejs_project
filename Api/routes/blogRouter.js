const express = require('express');
const router = express.Router();
const { upload, addBlog, editBlog, deleteBlog, getBlogs, viewBlog } = require('../controllers/blogController');
const auth = require('../middleware/auth');

// Routes
router.get('/', getBlogs);
router.get('/:id', viewBlog);
router.post('/add', auth, upload.single('image'), addBlog);
router.post('/edit/:id', auth, upload.single('image'), editBlog);
router.get('/delete/:id', auth, deleteBlog);

module.exports = router;
