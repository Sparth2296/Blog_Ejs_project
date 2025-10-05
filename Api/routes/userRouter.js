const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');

// Register Page
router.get('/register', (req, res) => {
  res.render('register', { message: '' });
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login', { message: '' });
});

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Logout
router.get('/logout', logoutUser);

module.exports = router;
