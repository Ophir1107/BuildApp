const constructorService = require('./constructor.service')
const logger = require('../../services/logger.service')


async function getConstructor(req, res) {
    try {
        const constructor = await constructorService.getById(req.params.id)
        res.send(constructor)
    } catch (err) {
        logger.error('Failed to get constructor', err)
        res.status(500).send({ err: 'Failed to get constructor' })
    }
}

async function getConstructors(req, res) {
    try {
        filter = req.query
        const constructors = await constructorService.query(filter)
        res.send(constructors)
    } catch (err) {
        logger.error('Failed to get constructors', err)
        res.status(500).send({ err: 'Failed to get constructors' })
    }
}

async function deleteConstructor(req, res) {
    try {
        await constructorService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete constructor', err)
        res.status(500).send({ err: 'Failed to delete constructor' })
    }
}

async function addConstructor(req, res) {
    try {
        const board = req.body
       const  savedBoard = await boardService.save(board)
        res.send(savedBoard)
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}

async function updateConstractor(req, res) {
    try {
        const user = req.body
        const savedUser = await constructorService.update(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getConstructor,
    getConstructors,
    addConstructor,
    deleteConstructor,
    updateConstractor
}