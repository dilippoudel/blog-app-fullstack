const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
usersRouter.get('/', async (req, res, next) => {
  try {
    const allUsers = await User.find({}).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
    })
    return res.json(allUsers)
  } catch (error) {
    next(error)
  }
})
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (username.length < 3 || password.length < 3) {
    return response
      .status(400)
      .json({ error: 'username or password must be at least 3 chars long' })
  }
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    passwordHash,
    name,
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})
module.exports = usersRouter
