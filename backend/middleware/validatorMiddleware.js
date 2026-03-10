const { check, validationResult } = require('express-validator');

// Validation for menu item
const validateMenu = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('price').isNumeric().withMessage('Price must be a number'),
  check('desc').not().isEmpty().withMessage('Description is required'),
  check('image').not().isEmpty().withMessage('Image URL is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateMenu };
