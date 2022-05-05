const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getBoards, getBoard, addBoard, updateBoard, removeBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)///

router.get('/', log, getBoards)
router.get('/:id', log, getBoard)
router.post('/', log, addBoard)
router.put('/:id', log, updateBoard)
// router.delete('/:id', log, requireAuth, removeBoard)
// router.delete('/:id', log, removeBoard)

module.exports = router