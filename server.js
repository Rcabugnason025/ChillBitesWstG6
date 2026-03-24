const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const passport = require('passport');
const connectDB = require('./backend/config/db');
const { errorHandler, notFound } = require('./backend/middleware/errorMiddleware');
const menuRoutes = require('./backend/routes/menuRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const orderRoutes = require('./backend/routes/orderRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
require('./backend/config/passport');
app.use(passport.initialize());

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
