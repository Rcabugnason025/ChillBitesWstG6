const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  googleLogin,
} = require('../controllers/userController');
const passport = require('passport');
const generateToken = require('../utils/generateToken');
require('../config/passport');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/google-login', googleLogin);

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login.html', session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const params = new URLSearchParams({
      token,
      id: req.user._id.toString(),
      email: req.user.email,
      username: req.user.username || '',
      isAdmin: req.user.isAdmin ? '1' : '0',
    });
    res.redirect(`/oauth-success.html#${params.toString()}`);
  }
);

router.route('/profile/:id').get(getUserProfile);

module.exports = router;
