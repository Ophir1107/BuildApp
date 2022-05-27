const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    add
}

async function add(user) {
    const {  fullname , field, phone  } = user
    try {
        // peek only updatable fields!
        const consToAdd = {
            fullname,
            phone,
            field,
            projects : []         
        }
        const collection = await dbService.getCollection('constructor')
        await collection.insertOne(consToAdd)
        console.log('user is added to db')
        return consToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}