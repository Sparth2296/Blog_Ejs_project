const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🧾 Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.render('login', { message: 'Email already registered ⚠️' });

    const hashPass = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashPass });

    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error during registration');
  }
};

// 🔑 Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.render('login', { message: 'User not found ❌' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render('login', { message: 'Invalid password ❌' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Store token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).send('Login error');
  }
};

// 🚪 Logout User
const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

module.exports = { registerUser, loginUser, logoutUser };
