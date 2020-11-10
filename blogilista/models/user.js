const { request } = require("express");
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    password: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.plugin(uniqueValidator)
userSchema.set('toJSON', {
    transform: (document, returned) => {
        returned.id = returned._id.toString()
        delete returned._id
        delete returned.__v
        delete returned.password
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User