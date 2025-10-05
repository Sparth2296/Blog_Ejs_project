require('dotenv').config();
console.log('Mongo URI:', process.env.MONGO_URI);
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/userRouter');
const blogRoutes = require('./routes/blogRouter');

const app = express();
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', userRoutes);
app.use('/blog', blogRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page Not Found 😢' });
});

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
