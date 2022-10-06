const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fs = require('fs')

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: hash,
        describe: 'Votre description ici',
        avatar: `${req.protocol}://${req.get(
          'host'
        )}/images/defaultPicture.png`,
      })
      user
        .save()
        .then(() =>
          res.status(201).json({
            userId: user._id,
            pseudo: user.pseudo,
            token: jwt.sign(
              { userId: user._id },
              `${process.env.RANDOM_TOKEN_SECRET}`,
              { expiresIn: '24h' }
            ),
            message: 'Utilisateur créé !',
          })
        )
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: 'Paire identifiant / mot de passe incorecte' })
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res
                .status(401)
                .json({ message: 'Paire identifiant / mot de passe incorecte' })
            } else {
              res.status(200).json({
                userId: user._id,
                pseudo: user.pseudo,
                avatar: user.avatar,
                describe: user.describe,
                token: jwt.sign(
                  { userId: user._id },
                  `${process.env.RANDOM_TOKEN_SECRET}`,
                  { expiresIn: '24h' }
                ),
              })
            }
          })
          .catch((error) => res.status(500).json({ error }))
      }
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' })
      } else if (req.params.userId === req.auth.userId) {
        res.status(200).json(user)
      } else {
        const publicUser = { ...user }
        delete publicUser._doc.password
        delete publicUser._doc._id
        delete publicUser._doc.email
        delete publicUser._doc.__v
        res.status(200).json(publicUser._doc)
      }
    })
    .catch((error) => res.status(400).json({ error }))
}

exports.modifyUser = (req, res, next) => {
  const userObject = req.file
    ? {
        ...JSON.parse(req.body.profile),
        avatar: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...JSON.parse(req.body.profile) }
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user._id.toString() !== req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (
          req.file &&
          user.avatar !== 'http://localhost:2000/images/defaultPicture.png'
        ) {
          const filename = user.avatar.split('/images')[1]
          fs.unlink(`images/${filename}`, () => {
            console.log('Image supprimé')
          })
        }
        User.updateOne(
          { _id: req.params.userId },
          { ...userObject, _id: req.params.userId }
        )
          .then(() => {
            if (req.file) {
              res.status(200).json({
                avatar: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
                }`,
                message: 'Utilisateur Modifié !',
              })
            } else res.status(200).json({avatar: user.avatar, message: 'Utilisateur Modifié !' })
          })
          .catch((error) => res.status(400).json({ error }))
      }
    })
    .catch((error) => res.status(400).json({ error }))
}
