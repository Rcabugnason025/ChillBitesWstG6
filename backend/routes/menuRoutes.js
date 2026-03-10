const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { validateMenu } = require('../middleware/validatorMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Define routes
router.route('/').get(getMenuItems).post(protect, admin, validateMenu, createMenuItem);
router.route('/upload').post(protect, admin, upload.single('image'), (req, res) => {
  res.send({
    message: 'Image uploaded successfully',
    url: req.file.location,
  });
});
router.route('/:id').get(getMenuItemById).put(protect, admin, validateMenu, updateMenuItem).delete(protect, admin, deleteMenuItem);

module.exports = router;
