const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByConstructorName,
    remove,
    update,
    add,
    save
}

async function add(constructor) {
    const {  fullname , field, phone  } = constructor
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
        return consToAdd
    } catch (err) {
        logger.error('cannot insert constructor', err)
        throw err
    }
}


async function save(constructor) {
    const { fullname , field , phone , projects} = constructor
    let savedConstructor
    if (constructor._id) {
        //UPDATE
        try {
            savedConstructor = {
                _id: ObjectId(constructor._id),
                fullname , 
                field , 
                phone , 
                projects
            }
            const collection = await dbService.getCollection('constructor')
            await collection.updateOne({ _id: savedConstructor._id }, { $set: savedConstructor })
            return savedConstructor


        } catch (err) {
            logger.error('cannot update constructor', err)
            throw err
        }
    } else {
        // CREATE
        try {
            savedConstructor = {
                _id: ObjectId(constructor._id),
                fullname , 
                field , 
                phone , 
                projects
            }
            const collection = await dbService.getCollection('constructor')
            await collection.insertOne(savedConstructor)
            return savedConstructor
        } catch (err) {
            logger.error('cannot add constructor', err)
            throw err
        }
    }
}


async function query(filterBy = {}) {
    const criteria = filterBy
    try {
        const collection = await dbService.getCollection('constructor')
        var constructors = await collection.find(criteria).toArray()
        return constructors
    } catch (err) {
        logger.error('cannot find constructors', err)
        throw err
    }
}

async function getById(constructorId) {
    try {
        const collection = await dbService.getCollection('constructor')
        const constructor = await collection.findOne({ '_id': ObjectId(constructorId) })
        return constructor
    } catch (err) {
        logger.error(`while finding constructor ${constructorId}`, err)
        throw err
    }
}

async function getByConstructorName(constructorName) {
    try {
        const collection = await dbService.getCollection('constructor')
        const constructor = await collection.findOne({ constructorName })
        return constructor
    } catch (err) {
        logger.error(`while finding constructor ${constructorName}`, err)
        
        throw err
    }
}

async function remove(constructorId) {
    try {
        const collection = await dbService.getCollection('constructor')
        await collection.deleteOne({ '_id': ObjectId(constructorId) })
    } catch (err) {
        logger.error(`cannot remove constructor ${constructorId}`, err)
        throw err
    }
}

async function update(constructor) {
    try {
        // peek only updatable fields!
        const constructorToSave = {
            _id: ObjectId(constructor._id),
            fullname: constructor.fullname,
            phone: constructor.phone,
            email: constructor.email,
            field: constructor.field,
        }
        const collection = await dbService.getCollection('constructor')
        await collection.updateOne({ '_id': constructorToSave._id }, { $set: constructorToSave })
        // const exsitConstructor = await collection.find({ '_id': constructorToSave._id }) 
        // exsitConstructor ? await collection.updateOne({ '_id': exsitConstructor._id}) : 
        //                 await collection.insertOne({constructorToSave})
        return constructorToSave;
    } catch (err) {
        logger.error(`cannot update constructor ${constructor._id}`, err)
        throw err
    }
}






