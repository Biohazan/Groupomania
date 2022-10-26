const Post = require('../models/Post')
const fs = require('fs')
const bcrypt = require('bcrypt')

exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post)
  delete postObject._id
  delete postObject.userId
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    pictureUrl: req.file
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      : null,
    likes: 0,
    dislikes: 0,
  })
  post
    .save()
    .then(() => res.status(201).json({ message: 'Post enregistré ! ' }))
    .catch((error) => res.status(400).json({ error }))
}

// Route PUT post
exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        pictureUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.post) }
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId !== req.auth.userId && !bcrypt.compareSync('adminSuperUser', postObject.role)) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (req.file && post.pictureUrl) {
          const filename = post.pictureUrl.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }
        Post.updateOne(
          { _id: req.params.id },
          { ...postObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Post Modifié !' }))
          .catch((error) => res.status(401).json({ error }))
      }
    })
    .catch((error) => res.status(400).json({ error }))
}

// Route DELETE post
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (
        post.userId !== req.auth.userId &&
        !bcrypt.compareSync('adminSuperUser', req.body.role)
      ) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (post.pictureUrl) {
          const filename = post.pictureUrl.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }
        Post.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Post Supprimé !' }))
          .catch((error) => res.status(401).json({ error }))
      }
    })
    .catch((error) => res.status(500).json({ error }))
}

// Route GET post
exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: 'Post non trouvé' })
      } else {
        res.status(200).json(post)
      }
    })
    .catch((error) => res.status(404).json({ error }))
}

exports.getAllPost = (req, res, next) => {
  Post.find()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }))
}

// Route like post
exports.likepost = (req, res, next) => {

  function postUpdate(postObject, postId) {
    Post.updateOne({ _id: postId }, { ...postObject._doc, _id: postId })
      .then(() => res.status(200).json({ message: 'Like enregistré' }))
      .catch((error) => res.status(400).json({ error }))
  }

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      const postObject = { ...post }
      if (
        !post.usersLiked.find((user) => user === req.auth.userId) &&
        !post.usersDisliked.find((user) => user === req.auth.userId)
      ) {
        switch (req.body.like) {
          case 1:
            postObject._doc.usersLiked.push(req.auth.userId)
            postObject._doc.likes++
            postUpdate({ ...postObject }, req.params.id)
            break
          case -1:
            postObject._doc.usersDisliked.push(req.auth.userId)
            postObject._doc.dislikes++
            postUpdate({ ...postObject }, req.params.id)
            break
          case 0:
            res.status(400).json({ message: 'Action non autorisé' })
            break
          default:
            break
        }
      } else if (
        post.usersLiked.find((user) => user === req.auth.userId) &&
        req.body.like === 0
      ) {
        let index = postObject._doc.usersLiked.indexOf(req.auth.userId)
        postObject._doc.usersLiked.splice(index, 1)
        postObject._doc.likes--
        postUpdate({ ...postObject }, req.params.id)
      } else if (
        post.usersDisliked.find((user) => user === req.auth.userId) &&
        req.body.like === 0
      ) {
        let index = postObject._doc.usersDisliked.indexOf(req.auth.userId)
        postObject._doc.usersDisliked.splice(index, 1)
        postObject._doc.dislikes--
        postUpdate({ ...postObject }, req.params.id)
      } else {
        res.status(400).json({ message: 'Action non autorisé' })
      }
    })
    .catch((error) => res.status(400).json({ error }))
}
