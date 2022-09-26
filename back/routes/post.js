const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const router = express.Router()

const postCtrl = require('../controllers/post')

router.post('/', auth, multer, postCtrl.createPost)
router.put('/:id', auth, multer, postCtrl.modifyPost)
router.delete('/:id', auth, postCtrl.deletePost)
router.get('/', auth, postCtrl.getAllPost);
router.post('/:id/like', auth, postCtrl.likepost)
router.get('/:id', auth, postCtrl.getOnePost);

module.exports = router