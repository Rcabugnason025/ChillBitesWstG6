const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Menu = require('./backend/models/Menu');
const User = require('./backend/models/User');
const connectDB = require('./backend/config/db');

dotenv.config();

const DEFAULT_MENU = [
  {
    name: 'Sizzling Sisig',
    price: 380,
    desc: 'Crispy pork sisig with onions and special sauce',
    image: 'images/sisig.jpg',
    available: true
  },
  {
    name: 'Chicken Adobo',
    price: 350,
    desc: 'Classic Filipino adobo with tender chicken',
    image: 'images/adobo.jpg',
    available: true
  },
  {
    name: 'Crispy Pata',
    price: 450,
    desc: 'Golden crispy pork knuckle with dipping sauce',
    image: 'images/pata.jpg',
    available: true
  },
  {
    name: 'Kare-Kare',
    price: 420,
    desc: 'Oxtail stew in rich peanut sauce with vegetables',
    image: 'images/karekare.jpg',
    available: true
  },
  {
    name: 'Pancit Canton',
    price: 250,
    desc: 'Stir-fried noodles with meat and vegetables',
    image: 'images/pancit.jpg',
    available: true
  },
  {
    name: 'Halo-Halo',
    price: 180,
    desc: 'Ultimate Filipino dessert with crushed ice and toppings',
    image: 'images/halo-halo.jpg',
    available: true
  },
  {
    name: 'Adobong Sitaw',
    price: 220,
    desc: 'Yummy string beans cooked in soy sauce and vinegar',
    image: 'images/Adobong sitaw.jpg',
    available: true
  },
  {
    name: 'Ampalaya Con Carne',
    price: 280,
    desc: 'Bitter melon with savory beef strips',
    image: 'images/Ampalaya Con Carne Recipe.jpg',
    available: true
  },
  {
    name: 'Batchoy Tagalog',
    price: 300,
    desc: 'Hearty noodle soup with pork organs and cracklings',
    image: 'images/Batchoy Tagalog.jpg',
    available: true
  },
  {
    name: 'Escabeche',
    price: 350,
    desc: 'Sweet and sour fish with colorful vegetables',
    image: 'images/Escabatche.jpg',
    available: true
  },
  {
    name: 'Pinakbet',
    price: 240,
    desc: 'Mixed vegetables sautéed in shrimp paste',
    image: 'images/Pinakbet.jpg',
    available: true
  },
  {
    name: 'Pork Hamonado',
    price: 380,
    desc: 'Sweet pork pineapple stew that melts in your mouth',
    image: 'images/Pork Hamonado.jpg',
    available: true
  },
  {
    name: 'Tofu and Broccoli',
    price: 200,
    desc: 'Healthy tofu and broccoli stir-fry',
    image: 'images/Tofu and Broccoli.jpg',
    available: true
  }
];

const DEFAULT_USERS = [
  {
    username: 'admin',
    email: 'admin@chillbites.com',
    password: 'admin',
    isAdmin: true
  }
];

const importData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Cleaning old data...');
    await Menu.deleteMany();
    await User.deleteMany();

    console.log('Importing new data...');
    await Menu.insertMany(DEFAULT_MENU);
    await User.insertMany(DEFAULT_USERS);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during import: ${error.message}`);
    process.exit(1);
  }
};

importData();
