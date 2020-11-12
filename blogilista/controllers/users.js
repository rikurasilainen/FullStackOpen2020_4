const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if (!body.password) {
        response.status(400).json({
            error: 'Valid password required'
        })
    }

    if (body.password.length < 3) {
        response.status(400).json({
            error: 'Password is too short (minimum 3 characters required)'
        })
    } else if (body.username.length < 3) {
        response.status(400).json({
            error: 'Username is too short (minimum 3 characters required)'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    console.log(passwordHash)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const saved = await user.save()
    response.json(saved)
})

module.exports = usersRouter
