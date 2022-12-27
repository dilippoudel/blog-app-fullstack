const blogpostRouter = require('express').Router()
const Blog = require('../models/blogpost')
blogpostRouter.get('/', async (req, res, next) => {
  try {
    const allBlogs = await Blog.find({})
    return res.json(allBlogs)
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
  try {
    await Blog.findByIdAndRemove(req.params.id)
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})
blogpostRouter.post('/', async (req, res, next) => {
  const body = req.body
  if (body === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })
  try {
    await blog.save().then((savedBlog) => res.send(savedBlog))
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
    likes: body.likes,
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
