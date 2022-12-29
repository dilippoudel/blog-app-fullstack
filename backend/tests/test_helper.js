require('dotenv').config()
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const newUser = {
  name: 'Hari Prasad',
  username: 'hari123',
  password: 'prasad123',
}
const loginCredential = {
  username: newUser.username,
  password: newUser.password,
}
const createUser = async () => {
  return await api.post('/api/users').send(newUser)
}
const loggedInUser = async () => {
  return await api.post('/api/login').send(loginCredential)
}
const createBlogPost = async () => {
  // step 1: register as user
  await createUser()
  // step2: log in to the app
  const response = await loggedInUser()
  // step 3: verifying the jwt token and create blog post
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(response.body.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)
  const newBlogPost = {
    title: 'Testing',
    author: 'Samita',
    url: 'https://linkedin/testing',
    likes: 20,
    userId: user._id,
  }
  return await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${response.body.token}`)
    .send(newBlogPost)
}
module.exports = { createUser, createBlogPost, loggedInUser }
