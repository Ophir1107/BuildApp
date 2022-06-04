const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { predict } = require('./predictor.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)///

// router.get('/', log, predict)


module.exports = router