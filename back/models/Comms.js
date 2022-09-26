const mongoose = require('mongoose')

const commsSchema = mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Number, require: true },
  text: { type: String, require: true },
  imageUrl: { type: String, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
})

module.exports = mongoose.model('Post', commsSchema)
