const testHelper = require('./test_helper')
const config = require('../utils/config')
const mongoose = require('mongoose')
const Blog = require('../models/blogpost')
const User = require('../models/user')

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI)
  await Blog.deleteMany({})
  await User.deleteMany()
}, 100000)
describe('creating new blogs', () => {
  test('only logged in user can create blog post', async () => {
    const res = await testHelper.createBlogPost()
    expect(res.statusCode).toBe(201)
  })
  test('blogpost should contain user id', async () => {})
})
// test('id shoud be defined in database', async () => {
//   const response = await api.get('/api/blogs')
//   const contents = response.body.map((content) => content)
//   for (let content of contents) {
//     expect(content.id).toBeDefined()
//   }
// })

// describe('When field(s) of blog(s) are missing', () => {
//   test('should check the likes property is assigned and default value is 0', async () => {
//     const newBlog = {
//       title: 'Super Test',
//       author: 'Shailendra',
//       link: 'https:link/shailendra/testing',
//     }
//     const response = await api.post('/api/blogs').send(newBlog).expect(201)
//     const blogFindById = await api.get(`/api/blogs/${response.body.id}`)
//     const parseBlog = await JSON.parse(JSON.stringify(blogFindById.body))
//     expect(parseBlog).toHaveProperty('likes', 0)
//   })
//   test('blogs should have title or url properties', async () => {
//     const newBlog = {
//       author: 'shailendra',
//     }
//     await api.post('/api/blogs').send(newBlog).expect(400)
//   })
// })
// describe('deletion of a blog', () => {
//   test('succeeds with status code 204 if id is valid', async () => {
//     const oldBlogs = await Blog.find({})
//     const blogToDelete = oldBlogs[0]
//     await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
//     const newBlogs = await Blog.find({})
//     expect(newBlogs).toHaveLength(oldBlogs.length - 1)
//   })
//   test('fails with status coded 4000 if id is invalid', async () => {
//     const invalidBlogId = '5a3d5da59070081a82a3445'
//     await api.get(`/api/blogs/${invalidBlogId}`).expect(400)
//   })
// })
