const testHelper = require('./test_helper')
const config = require('../utils/config')
const mongoose = require('mongoose')
const Blog = require('../models/blogpost')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await mongoose.connect(config.MONGODB_URI)
  await Blog.deleteMany({})
  await User.deleteMany()
}, 100000)
describe('creating new blogs', () => {
  test('only logged in user can create blog post', async () => {
    const res = await testHelper.createBlogPost()
    expect(res.statusCode).toBe(201)
  })
  test('blogpost should contain user', async () => {
    await testHelper.createBlogPost()
    const blogs = await api.get('/api/blogs')
    const users = blogs.body.map((blog) => blog.user)
    expect(users[0]).toHaveProperty('username', 'hari123')
    for (let user of users) {
      expect(user.id).toBeDefined()
    }
  })
})

describe('blogs validations', () => {
  test('should check the likes property is assigned and default value is 0', async () => {
    await testHelper.createBlogPost()
    const blogs = await api.get('/api/blogs/')
    expect(blogs.body[0]).toHaveProperty('likes', 0)
  })
  test('blogs must have either title or url properties', async () => {
    const newBlog = {
      author: 'shailendra',
    }
    await testHelper.createUser()
    const loginResponse = await testHelper.loggedInUser()
    const blogPostResponse = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginResponse.body.token}`)
      .send(newBlog)
    expect(blogPostResponse.statusCode).toBe(400)
    expect(blogPostResponse.body).toEqual({
      error: 'title or url is mandatory',
    })
  })
})
describe('deletion of a blog', () => {
  test('Only the authorized user can delete his/her blog', async () => {
    await testHelper.createUser()
    const logInResponse = await testHelper.loggedInUser()
    await testHelper.createBlogPost()
    const oldBlogs = await Blog.find({})
    const blogsToDelete = oldBlogs[0]._id.toString()

    await api
      .delete(`/api/blogs/${blogsToDelete}`)
      .set('Authorization', `bearer ${logInResponse.body.token}`)
      .expect(204)
    const newBlogs = await Blog.find({})
    expect(newBlogs).toHaveLength(oldBlogs.length - 1)
  })
})
