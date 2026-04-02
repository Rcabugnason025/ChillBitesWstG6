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
  {
    name: 'Adobong Sitaw',
    price: 220,
    desc: 'Yummy string beans cooked in soy sauce and vinegar',
    image: 'images/Adobong sitaw.jpg',
    available: true,
  },
  {
    name: 'Ampalaya Con Carne',
    price: 280,
    desc: 'Bitter melon with savory beef strips',
    image: 'images/Ampalaya Con Carne Recipe.jpg',
    available: true,
  },
  {
    name: 'Batchoy Tagalog',
    price: 300,
    desc: 'Hearty noodle soup with pork organs and cracklings',
    image: 'images/Batchoy Tagalog.jpg',
    available: true,
  },
  {
    name: 'Escabeche',
    price: 350,
    desc: 'Sweet and sour fish with colorful vegetables',
    image: 'images/Escabatche.jpg',
    available: true,
  },
  {
    name: 'Pinakbet',
    price: 240,
    desc: 'Mixed vegetables sautéed in shrimp paste',
    image: 'images/Pinakbet.jpg',
    available: true,
  },
  {
    name: 'Pork Hamonado',
    price: 380,
    desc: 'Sweet pork pineapple stew that melts in your mouth',
    image: 'images/Pork Hamonado.jpg',
    available: true,
  },
  {
    name: 'Tofu and Broccoli',
    price: 200,
    desc: 'Healthy tofu and broccoli stir-fry',
    image: 'images/Tofu and Broccoli.jpg',
    available: true,
  },
];

const normalizeMenuName = (value) => String(value || '').trim().replace(/\s+/g, ' ');

const dedupeMenu = async () => {
  const items = await Menu.find({}).sort({ updatedAt: -1 });
  const seen = new Set();
  const idsToDelete = [];
  for (const item of items) {
    const key = item && item.name ? normalizeMenuName(item.name).toLowerCase() : '';
    if (!key) continue;
    if (seen.has(key)) {
      idsToDelete.push(item._id);
    } else {
      seen.add(key);
    }
  }
  if (idsToDelete.length) {
    await Menu.deleteMany({ _id: { $in: idsToDelete } });
  }
};

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

    for (const item of DEFAULT_MENU) {
      const normalizedName = normalizeMenuName(item.name);
      await Menu.updateOne({ name: normalizedName }, { $set: { ...item, name: normalizedName } }, { upsert: true });
    }
    await dedupeMenu();
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
