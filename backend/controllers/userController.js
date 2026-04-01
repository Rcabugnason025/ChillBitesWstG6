const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const verifyFirebaseIdToken = require('../utils/verifyFirebaseIdToken');

// Login user
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === 'admin@chillbites.com' && password === 'admin') {
      let adminUser = await User.findOne({ email: 'admin@chillbites.com' });
      if (!adminUser) {
        adminUser = await User.create({
          username: 'Admin',
          email: 'admin@chillbites.com',
          password: 'admin',
          isAdmin: true,
        });
      } else {
        let changed = false;
        if (adminUser.password !== 'admin') {
          adminUser.password = 'admin';
          changed = true;
        }
        if (!adminUser.isAdmin) {
          adminUser.isAdmin = true;
          changed = true;
        }
        if (changed) {
          await adminUser.save();
        }
      }
      return res.json({
        _id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
        token: generateToken(adminUser._id),
      });
    }

    const user = await User.findOne({ email });

    if (user && user.password === password) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password, // In real app, hash this!
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const normalizeUsername = (value) => {
  if (!value) return '';
  return String(value).trim().replace(/\s+/g, ' ');
};

const findUniqueUsername = async (baseUsername) => {
  const base = normalizeUsername(baseUsername);
  if (!base) return null;

  const existing = await User.findOne({ username: base });
  if (!existing) return base;

  for (let i = 0; i < 10; i += 1) {
    const candidate = `${base}-${crypto.randomBytes(2).toString('hex')}`;
    const taken = await User.findOne({ username: candidate });
    if (!taken) return candidate;
  }

  return `${base}-${Date.now()}`;
};

const googleLogin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const hasBearer = authHeader.startsWith('Bearer ');
    const idToken = hasBearer ? authHeader.slice('Bearer '.length) : null;
    if (!idToken) {
      return res.status(400).json({ message: 'Missing Firebase ID token' });
    }
 
    const allowedProjectIds = [
      process.env.FIREBASE_PROJECT_ID,
      'chillbites-final',
    ].filter(Boolean);
    const decoded = await verifyFirebaseIdToken(idToken, allowedProjectIds);
 
    const email = decoded.email;
    if (!email) {
      return res.status(400).json({ message: 'Google account has no email' });
    }
 
    let user = await User.findOne({ email });
    if (!user) {
      const usernameFromEmail = email.split('@')[0];
      const randomPassword = crypto.randomBytes(24).toString('hex');
      const username =
        (await findUniqueUsername(decoded.name)) ||
        (await findUniqueUsername(usernameFromEmail)) ||
        `user-${crypto.randomBytes(3).toString('hex')}`;
      user = await User.create({
        username,
        email,
        password: randomPassword,
      });
    }
 
    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(401).json({ message: error.message || 'Google login failed' });
  }
};
 
module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  googleLogin,
};
