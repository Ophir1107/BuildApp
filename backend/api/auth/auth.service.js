const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password ) {
    logger.debug(`auth.service - login with username: ${username}`)
    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')
    delete user.password
    user.isOnline = true
    console.log(user, "user from login")
    const loggedinUser = await userService.update(user)
    return loggedinUser
}



async function signup(username, password, fullname , userType , phone , email) {
    const saltRounds = 10
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname || !userType) return Promise.reject('fullname, username and password are required!')
    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname , userType , phone , email})
}

async function addConstructor(fullname, phone, field, projects) {
    const saltRounds = 10
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname || !userType) return Promise.reject('fullname, username and password are required!')
    const hash = await bcrypt.hash(password, saltRounds) 
    return fullname
}



async function logout(user) {
    user.isOnline = false
    await userService.update(user)
}

module.exports = {
    signup,
    login,
    logout,
    addConstructor
}