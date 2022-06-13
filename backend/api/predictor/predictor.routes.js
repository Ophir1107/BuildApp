const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { predict } = require('./predictor.controller')
const router = express.Router()

module.exports = router