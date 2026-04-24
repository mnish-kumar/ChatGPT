const { body, validationResult } = require('express-validator');

const validateError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


const registerValidators = [
    body('username')
        .isLength({ min: 3 })
        .isString()
        .withMessage('Username must be a string'),
    body('email')
        .isEmail()
        .isMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname')
        .isString()
        .notEmpty()
        .withMessage('First name is required'),
    body('fullname.lastname')
        .isString()
        .notEmpty()
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
        .isMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage('Invalid email address'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    validateError
]


module.exports = {
    registerValidators,
    loginValidators
}