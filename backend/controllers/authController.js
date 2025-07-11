const ExpressError = require('../utils/expressError');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/Jwt');
const User = require('../models/User');
const Task = require('../models/Task');

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction, 
  sameSite: isProduction ? 'none' : 'lax', // 'none' only works with HTTPS
  maxAge: 24 * 60 * 60 * 1000 
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ExpressError(400, 'Name, email, and password are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ExpressError(409, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  const token = generateToken(newUser._id);
  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    message: 'User Registered successfully',
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    }
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ExpressError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError(401, 'User not registered');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ExpressError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id);
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none': 'lax'
  });

  res.status(200).json({ message: 'Logout successful' });
};

const getUserProfile = async (req, res) => {
  const user = req.user;
  
  const tasks = await Task.find({ assignedTo: user._id });

  res.json({ user, tasks });
};


module.exports = {
  registerUser,
  loginUser,
  logout,
  getUserProfile
};
