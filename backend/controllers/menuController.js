const Menu = require('../models/Menu');
const resolvePublicImage = require('../utils/resolvePublicImage');

function normalizeMenuName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get all menu items
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find({}).sort({ updatedAt: -1 });
    const seen = new Set();
    const unique = [];
    for (const item of menuItems) {
      const key = item && item.name ? normalizeMenuName(item.name).toLowerCase() : '';
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }
    res.json(unique.map((x) => ({
      ...x.toObject(),
      image: resolvePublicImage(x.image),
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single menu item
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (menuItem) {
      res.json({
        ...menuItem.toObject(),
        image: resolvePublicImage(menuItem.image),
      });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a menu item
const createMenuItem = async (req, res) => {
  try {
    const { name, price, desc, image, available } = req.body;
    const normalizedName = normalizeMenuName(name);
    const existing = normalizedName
      ? await Menu.findOne({ name: new RegExp(`^${escapeRegExp(normalizedName)}$`, 'i') })
      : null;

    if (existing) {
      existing.name = normalizedName || existing.name;
      existing.price = price !== undefined ? price : existing.price;
      existing.desc = desc !== undefined ? desc : existing.desc;
      existing.image = image !== undefined ? image : existing.image;
      existing.available = available !== undefined ? available : existing.available;
      const updated = await existing.save();
      return res.json(updated);
    }

    const menuItem = new Menu({
      name: normalizedName,
      price,
      desc,
      image,
      available,
    });
    const createdMenuItem = await menuItem.save();
    return res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const { name, price, desc, image, available } = req.body;
    const menuItem = await Menu.findById(req.params.id);

    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.price = price || menuItem.price;
      menuItem.desc = desc || menuItem.desc;
      menuItem.image = image || menuItem.image;
      menuItem.available = available !== undefined ? available : menuItem.available;

      const updatedMenuItem = await menuItem.save();
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (menuItem) {
      await menuItem.deleteOne();
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
