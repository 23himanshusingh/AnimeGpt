/* eslint-disable */
const { body, validationResult } = require('express-validator');

// Reusable middleware to handle validation errors from any route
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return the first error message for a cleaner response, using { error } key
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// Reusable validation rule for email
const emailValidation = body('email')
  .exists({ checkFalsy: true }).withMessage('Please enter your email address.')
  .bail()
  .trim()
  .isEmail().withMessage('The email address you entered is not valid. Please check it and try again.')
  .normalizeEmail();

// Reusable validation rule for a simple password check (used for login)
const passwordLoginValidation = body('password')
  .exists({ checkFalsy: true }).withMessage('Please enter your password.');

// --- Exported Middleware Arrays ---

const validateRegister = [
  emailValidation,
  body('password')
    .exists({ checkFalsy: true }).withMessage('You must create a password.')
    .bail()
    .isLength({ min: 8 }).withMessage('Your password must be at least 8 characters long.')
    .matches(/[a-z]/).withMessage('Your password needs at least one lowercase letter.')
    .matches(/[A-Z]/).withMessage('Your password needs at least one uppercase letter.')
    .matches(/[0-9]/).withMessage('Your password needs at least one number.')
    .matches(/[^A-Za-z0-9]/).withMessage('Your password needs at least one symbol (e.g., !, @, #).'),
  handleValidationErrors, // Apply the error handler at the end
];

const validateLogin = [
  emailValidation,
  passwordLoginValidation,
  handleValidationErrors, // Re-use the same error handler
];

module.exports = {
  validateRegister,
  validateLogin,
};