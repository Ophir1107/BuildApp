
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = filterBy
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        console.log('user from mongodb', user)
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    console.log('user update' , user )
    try {
        // peek only updatable fields!
        const userToSave = {
            _id: ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            isOnline: user.isOnline,
            userType: user.userType,
            imgUrl: user.imgUrl 
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ '_id': userToSave._id }, { $set: userToSave })
        // const exsitUser = await collection.find({ '_id': userToSave._id }) 
        // exsitUser ? await collection.updateOne({ '_id': exsitUser._id}) : 
        //                 await collection.insertOne({userToSave})
        console.log('user in update',userToSave);
        return userToSave;
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    const { username, password, fullname , userType } = user
    try {
        // peek only updatable fields!
        const userToAdd = {
            username,
            password,
            userType,
            fullname,
            isAdmin: false,
            isOnline: false,
            createdAt: ObjectId(user._id).getTimestamp(),
            projects : []
            
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        console.log('user is added to db')
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}



