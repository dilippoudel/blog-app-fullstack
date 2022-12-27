const config = require('../utils/config')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogpost')
const blogsLists = [
  {
    author: 'Dilip Poudel',
    title: 'writing backend testing',
    link: 'https://link/dilip/testing',
    likes: 24,
  },
  {
    author: 'Samita Poudel',
    title: 'writing Api testing',
    link: 'https://link/samita/testing',
    likes: 14,
  },
]
describe('testing blogs', () => {
  beforeEach(async () => {
    await mongoose.connect(config.MONGODB_URI)
    await Blog.deleteMany({})
    await new Blog(blogsLists[0]).save()
    await new Blog(blogsLists[1]).save()
  }, 1000000)
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('blogs have number of blog of blogLists', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogsLists.length)
  })
  test('id shoud be defined in database', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map((content) => content)
    for (let content of contents) {
      expect(content.id).toBeDefined()
    }
  })
})

afterAll(() => {
  mongoose.connection.close()
})
