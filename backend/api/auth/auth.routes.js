const express = require('express')
<<<<<<< HEAD
const { login,signup,addcons, logout, googleLogin } = require('./auth.controller')
=======
const { login, signup, logout, googleLogin, addConstructor } = require('./auth.controller')
>>>>>>> 1d7ebde1001657a5e5a0b3bbf4d1b6b94fab3dfa

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
<<<<<<< HEAD
router.post('/constructor', addcons)
=======
router.post('/addconstructor', addConstructor)
>>>>>>> 1d7ebde1001657a5e5a0b3bbf4d1b6b94fab3dfa
router.post('/logout', logout)
router.post('/googlelogin', googleLogin)

module.exports = router