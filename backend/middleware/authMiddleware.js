const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ExpressError = require('../utils/expressError');

const authenticate = async (req, res, next) => {
  let token;

  // First check cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Then check Authorization header
  else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ExpressError(401, 'No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ExpressError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(new ExpressError(401, 'Token is invalid or expired'));
  }
};

module.exports = authenticate;
