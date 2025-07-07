const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ExpressError = require('../utils/expressError');

const authenticate = async (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

  if (!token) {
    throw new ExpressError(401, "No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ExpressError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ExpressError(401, "Token is invalid or expired");
  }
};

module.exports = authenticate;
