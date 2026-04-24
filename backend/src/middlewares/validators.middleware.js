const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');

const validateError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


const registerValidators = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .trim()
        .isString()
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
    body('fullname.firstname')
        .isString()
        .notEmpty()
        .isLength({ min: 2})
        .withMessage('First name is required'),
    body('fullname.lastname')
        .isString()
        .notEmpty()
        .isLength({ min: 2})
        .withMessage('Last name is required'),
    
    validateError
]


const loginValidators = [
    body('username')
        .optional({ values: 'falsy' })
        .isLength({ min: 3 })
        .isString()
        .withMessage('Username must be a string'),
        
    body('email')
        .optional({ values: 'falsy' })
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('email').custom(async (email) => {
        const user = await userModel.findOne({ email });
        if (user) {
            throw new Error('Email already in use');
        }
    }),

    validateError
]


module.exports = {
    registerValidators,
    loginValidators
}