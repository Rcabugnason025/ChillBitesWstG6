const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Menu = require('../models/Menu');

dotenv.config();

const DEFAULT_MENU = [
  {
    name: 'Sizzling Sisig',
    price: 380,
    desc: 'Crispy pork sisig with onions and special sauce',
    image: 'images/sisig.jpg',
    available: true,
  },
  {
    name: 'Chicken Adobo',
    price: 350,
    desc: 'Classic Filipino adobo with tender chicken',
    image: 'images/adobo.jpg',
    available: true,
  },
  {
    name: 'Crispy Pata',
    price: 450,
    desc: 'Golden crispy pork knuckle with dipping sauce',
    image: 'images/pata.jpg',
    available: true,
  },
  {
    name: 'Kare-Kare',
    price: 420,
    desc: 'Oxtail stew in rich peanut sauce with vegetables',
    image: 'images/karekare.jpg',
    available: true,
  },
  {
    name: 'Pancit Canton',
    price: 250,
    desc: 'Stir-fried noodles with meat and vegetables',
    image: 'images/pancit.jpg',
    available: true,
  },
  {
    name: 'Halo-Halo',
    price: 180,
    desc: 'Ultimate Filipino dessert with crushed ice and toppings',
    image: 'images/halo-halo.jpg',
    available: true,
  },
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chillbites', {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await User.updateOne(
      { email: 'admin@chillbites.com' },
      {
        $set: {
          username: 'Admin',
          email: 'admin@chillbites.com',
          password: 'admin',
          isAdmin: true,
        },
      },
      { upsert: true }
    );

    const menuCount = await Menu.countDocuments();
    if (menuCount === 0) {
      await Menu.insertMany(DEFAULT_MENU);
    }
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    if (process.env.ALLOW_NO_DB === 'true') {
      console.log('Server continuing without database connection (ALLOW_NO_DB=true).');
      return;
    }
    process.exit(1);
  }
};

module.exports = connectDB;
