/* eslint-disable */
const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('email')
    .exists({ checkFalsy: true }).withMessage('Email is required')
    .bail()
    .isString().withMessage('Email must be a string')
    .bail()
    .trim()
    .isEmail().withMessage('Invalid email')
    .bail()
    .normalizeEmail(),
  body('password')
    .exists({ checkFalsy: true }).withMessage('Password is required')
    .bail()
    .isString().withMessage('Password must be a string')
    .bail()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a symbol')
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array().map(e => ({ field: e.path, msg: e.msg })) });
    }
    next();
  },
];

const validateLogin = [
  body('email')
    .exists({ checkFalsy: true }).withMessage('Email is required')
    .bail()
    .isString().withMessage('Email must be a string')
    .bail()
    .trim()
    .isEmail().withMessage('Invalid email')
    .bail()
    .normalizeEmail(),
  body('password')
    .exists({ checkFalsy: true }).withMessage('Password is required')
    .bail()
    .isString().withMessage('Password must be a string')
    .bail()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array().map(e => ({ field: e.path, msg: e.msg })) });
    }
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
};
