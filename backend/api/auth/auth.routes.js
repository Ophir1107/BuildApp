const express = require('express')
const { login, signup, logout, googleLogin, addConstructor } = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/addconstructor', addConstructor)
router.post('/logout', logout)
router.post('/googlelogin', googleLogin)

module.exports = router