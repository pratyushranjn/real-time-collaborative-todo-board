const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper.js");
const authenticate = require('../middleware/authMiddleware.js')

const {
    registerUser,
    loginUser,
    logout,
    getUserProfile,
} = require("../controllers/authController.js");


router.post('/register', asyncWrapper(registerUser));

router.post('/login', asyncWrapper(loginUser));

router.post("/logout", logout);

router.get('/me', authenticate, getUserProfile);

router.get("/protected-route", authenticate, (req, res) => {
    res.json(`Welcome user ${req.user.id}`);
});

module.exports = router