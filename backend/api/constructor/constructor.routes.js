const express = require('express')
const { log } = require('../../middlewares/logger.middleware')
const { getConstructors, getConstructor, addConstructor, updateConstractor, deleteConstructor } = require('./constructor.controller')
const router = express.Router()

router.get('/', log, getConstructors)
router.get('/:id', log, getConstructor)
router.post('/', log, addConstructor)
router.put('/:id', log, updateConstractor)
router.delete('/:id', log, deleteConstructor)

module.exports = router