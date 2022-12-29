require('dotenv').config()
const { response } = require('express')
const jwt = require('jsonwebtoken')
const blogpostRouter = require('express').Router()
const Blog = require('../models/blogpost')
const User = require('../models/user')
blogpostRouter.get('/', async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    })
    res.json(allBlogs)
  } catch (error) {
    next(error)
  }
})
blogpostRouter.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    return res.send(blog)
  } catch (error) {
    next(error)
  }
})
blogpostRouter.delete('/:id', async (req, res, next) => {
  console.log('token is ', req.token)
  try {
    await Blog.findByIdAndRemove(req.params.id)
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})
blogpostRouter.post('/', async (req, res, next) => {
  const body = req.body
  const token = req.token
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  if (body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }
  if (body.title === undefined || body.url === undefined) {
    return res.status(400).json({ error: 'title or url is mandatory' })
  }
  const user = await User.findById(body.userId)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id,
  })
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).send(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogpostRouter.put('/:id', async (req, res, next) => {
  const body = req.body
  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlog, {
      new: true,
    })
    res.json({ updatedBlog })
  } catch (error) {
    next(error)
  }
})

module.exports = blogpostRouter
