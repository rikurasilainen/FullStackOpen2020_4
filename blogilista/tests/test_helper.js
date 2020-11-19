const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = require('./data').testBlogs
const initialUsers = requite('./data').testUsers

const nonExistingId = async () => {
    const blog = new Blog({ _id: "5a422bc61b54a676234d17fc", title: "remove", author: "none", url: "nourl", likes: 0, __v: 0 })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, nonExistingId, blogsInDb, usersInDb, initialUsers }