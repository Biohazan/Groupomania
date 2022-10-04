const Comments = require('../models/Comments')
const fs = require('fs')

exports.createComments = (req, res, next) => {
  const commentsObject = JSON.parse(req.body.postComments)
  delete commentsObject._id
  const postComments = {
    ...commentsObject,
    userId: req.auth.userId,
    imageUrl: req.file
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      : null,
    likes: 0,
    dislikes: 0,
  }
  Comments.findOne({ _id: req.params.postId })
    .then((comments) => {
      if (!comments) {
        const comments = new Comments({
          _id: req.params.postId,
          postId: req.params.postId,
          postComments: postComments,
        })
        comments
          .save()
          .then(() =>
            res.status(201).json({ message: 'Commentaire enregistré ! ' })
          )
          .catch((error) => res.status(400).json({ error }))
      } else {
        comments.postComments.push(postComments)
        comments
          .save()
          .then(() =>
            res.status(200).json({ message: 'Commentaire Modifié !' })
          )
          .catch((error) => res.status(401).json({ error }))
      }
    })
    .catch((error) => res.status(401).json({ error }))
}

exports.modifyComments = (req, res, next) => {
  const commentsObject = req.file
    ? {
        ...JSON.parse(req.body.comments),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.comments) }
  delete commentsObject.userId
  Comments.findOne({ _id: req.params.id })
    .then((comments) => {
      if (comments.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (req.file) {
          const filename = comments.imageUrl.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }

        Comments.updateOne(
          { _id: req.params.id },
          { ...commentsObject, _id: req.params.id }
        )
          .then(() =>
            res.status(200).json({ message: 'Commentaire Modifié !' })
          )
          .catch((error) => res.status(401).json({ error }))
      }
    })
    .catch((error) => res.status(400).json({ error }))
}

exports.deleteComments = (req, res, next) => {
  Comments.findOne({ _id: req.params.postId })
    .then((comments) => {
      let comment = comments.postComments.id({ _id: req.params.commsId })
      if (comment.userId !== req.auth.userId) {
        res.status(402).json({ message: 'Non autorisé' })
      } 
      else if (req.body.delete !== 'deleteComms') {res.status(401).json({ message: 'Non autorisé2' })}
      else {
        if (comment.imageUrl) {
          const filename = comment.imageUrl.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }
        comments.postComments.pull({ _id: req.params.commsId })
      comments
        .save()
        .then(() => res.status(200).json({ message: 'Commentaire Supprimé' }))
        .catch((error) => res.status(400).json({ error }))
      }
    })
    .catch((error) => res.status(400).json({ error }))
}

exports.getOneComments = (req, res, next) => {
  Comments.findById(req.params.postId)
    .then((comments) => {
      if (!comments) {
        return res.status(200).json({ message: 'Pas de commentaire' })
      } else {
        res.status(200).json(comments)
      }
    })
    .catch((error) => res.status(404).json({ error }))
}

// exports.getAllComments = (req, res, next) => {
//     Comments.find()
//     .then((commentss) => res.status(200).json(commentss))
//     .catch((error) => res.status(400).json({ error }))
// }

exports.likeComments = (req, res, next) => {
  let isLikes
  function commentsUpdate(array, arrayLength, commentsId) {
    if (isLikes === true) {
      Comments.updateOne(
        { _id: commentsId },
        { likes: arrayLength, usersLiked: array, _id: commentsId }
      )
        .then(() => res.status(200).json({ message: 'Like enregistré' }))
        .catch((error) => res.status(400).json({ error }))
    } else {
      Comments.updateOne(
        { _id: commentsId },
        { dislikes: arrayLength, usersDisliked: array, _id: commentsId }
      )
        .then(() => res.status(200).json({ message: 'Dislike enregistré' }))
        .catch((error) => res.status(400).json({ error }))
    }
  }
  Comments.findOne({ _id: req.params.id })
    .then((comments) => {
      if (
        !comments.usersLiked.find((user) => user === req.auth.userId) &&
        !comments.usersDisliked.find((user) => user === req.auth.userId)
      ) {
        switch (req.body.like) {
          case 1:
            isLikes = true
            let likedArray = comments.usersLiked
            likedArray.push(req.auth.userId)
            commentsUpdate(
              likedArray,
              comments.usersLiked.length,
              req.params.id
            )
            break
          case -1:
            isLikes = false
            let dislikedArray = comments.usersDisliked
            dislikedArray.push(req.auth.userId)
            commentsUpdate(
              dislikedArray,
              comments.usersDisliked.length,
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
        comments.usersLiked.find((user) => user === req.auth.userId) &&
        req.body.like === 0
      ) {
        isLikes = true
        let likedArray = comments.usersLiked
        let index = likedArray.indexOf(req.auth.userId)
        likedArray.splice(index, 1)
        commentsUpdate(likedArray, comments.usersLiked.length, req.params.id)
      } else if (
        comments.usersDisliked.find((user) => user === req.auth.userId) &&
        req.body.like === 0
      ) {
        isLikes = false
        let dislikedArray = comments.usersDisliked
        let index = dislikedArray.indexOf(req.auth.userId)
        dislikedArray.splice(index, 1)
        commentsUpdate(dislikedArray, dislikedArray.length, req.params.id)
      } else {
        res.status(400).json({ message: 'Action non autorisé' })
      }
    })
    .catch((error) => res.status(400).json({ error }))
}
