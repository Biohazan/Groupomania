const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  author: { type: String, required: true },
  avatar: { type: String, required: true },
  date: {type: String, require: true},
  text:  {type: String, require: true},
  pictureUrl: { type: String},
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array }
});

module.exports = mongoose.model('Post', postSchema);