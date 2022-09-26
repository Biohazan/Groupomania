const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    pseudo: {type: String, require: true},
    pictureUrl: {type: String}
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)