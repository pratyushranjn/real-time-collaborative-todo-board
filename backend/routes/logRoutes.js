const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper.js");
const { getLogs } = require('../controllers/logController.js')

router.get('/', asyncWrapper(getLogs))

module.exports = router