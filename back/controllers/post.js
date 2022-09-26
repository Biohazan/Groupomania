const Post = require('../models/Post')
const fs = require('fs')

exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post)
  console.log(postObject)
  delete postObject._id
  delete postObject.userId
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }` : null,
    likes: 0,
    dislikes: 0,
  })
  post
    .save()
    .then(() => res.status(201).json({ post: true, message: 'Post enregistré ! ' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.post)}
  delete postObject.userId
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (req.file) {
          const filename = post.imageUrl.split('/images')[1]
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

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (post.imageUrl) {
          const filename = post.imageUrl.split('/images')[1]
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

exports.likepost = (req, res, next) => {
  let isLikes
  function postUpdate(array, arrayLength, postId) {
    if (isLikes === true) {
      Post.updateOne(
        { _id: postId },
        { likes: arrayLength, usersLiked: array, _id: postId }
      )
        .then(() => res.status(200).json({ message: 'Like enregistré' }))
        .catch((error) => res.status(400).json({ error }))
    } else {
      Post.updateOne(
        { _id: postId },
        { dislikes: arrayLength, usersDisliked: array, _id: postId }
      )
        .then(() => res.status(200).json({ message: 'Dislike enregistré' }))
        .catch((error) => res.status(400).json({ error }))
    }
  }
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (
        !post.usersLiked.find((user) => user === req.auth.userId) &&
        !post.usersDisliked.find((user) => user === req.auth.userId)
      ) {
        switch (req.body.like) {
          case 1:
            isLikes = true
            let likedArray = post.usersLiked
            likedArray.push(req.auth.userId)
            postUpdate(likedArray, post.usersLiked.length, req.params.id)
            break
          case -1:
            isLikes = false
            let dislikedArray = post.usersDisliked
            dislikedArray.push(req.auth.userId)
            postUpdate(
              dislikedArray,
              post.usersDisliked.length,
              req.params.id
            )
            break
          case 0:
            res.status(400).json({ message: 'Action non autorisé' })
            break
          default: 
          console.log('error5')
          break
        }
      } else if (
        post.usersLiked.find((user) => user === req.auth.userId) &&
        req.body.like === 0
      ) {

        isLikes = true
        let likedArray = post.usersLiked
        let index = likedArray.indexOf(req.auth.userId)
        likedArray.splice(index, 1)
        postUpdate(likedArray, post.usersLiked.length, req.params.id)
      } else if (
        post.usersDisliked.find((user) => user === req.auth.userId) &&
        req.body.like === 0
      ) {
        isLikes = false
        let dislikedArray = post.usersDisliked
        let index = dislikedArray.indexOf(req.auth.userId)
        dislikedArray.splice(index, 1)
        postUpdate(dislikedArray, dislikedArray.length, req.params.id)
      } else {
        res.status(400).json({ message: 'Action non autorisé' })
      }
    })
    .catch((error) => res.status(400).json({ error }))
}
