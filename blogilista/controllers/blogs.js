const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { isError } = require('lodash')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = request.token
  const decoded = jwt.verify(token, process.env.SECRET)
  if (!token || !decoded.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decoded.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  savedBlog.populate('user', { username: 1, name: 1, id: 1 }).execPopulate()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  const decoded = jwt.verify(token, process.env.SECRET)
  if (!token || !decoded.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const user = await User.findById(decoded.id)
  const blog = await Blog.findById(request.params.id)
  if (user && blog && blog.user.toString() === user.id.toString()) {
    user.blogs = user.blogs.filter(blog => blog.id.toString() !== user.id.toString())
    await blog.remove()
    await user.save()
    return response.status(204).json({message: 'blog deleted'})
  }
  return response.status(400).json({error: 'given id does not match a blog in the database, nothing deleted'})
})

blogsRouter.put('/:id', async (request, response) => {
  const updated = await Blog.findByIdAndUpdate({ _id: request.params.id }, request.body, { new: true })
  response.json(updated)
})

module.exports = blogsRouter