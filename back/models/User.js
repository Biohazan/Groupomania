const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    pseudo: {type: String, require: true},
    avatar: {type: String},
    describe: {type: String}
})

userSchema.plugin(uniqueValidator, {message: "Cet email est déja pris !"})

module.exports = mongoose.model('User', userSchema)