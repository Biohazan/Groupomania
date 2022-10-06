const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')
const email = require('../middleware/email')
const password = require('../middleware/password')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')


router.post('/signup', email, password, userCtrl.signup)
router.post('/login', userCtrl.login)
router.get('/:userId', auth, userCtrl.getUser)
router.put('/:userId', auth, multer, userCtrl.modifyUser)

module.exports = router
