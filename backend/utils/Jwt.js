const jwt = require('jsonwebtoken');
const ExpressError = require('../utils/expressError');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

module.exports = generateToken;
