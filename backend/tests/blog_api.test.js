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
beforeEach(async () => {
  await mongoose.connect(config.MONGODB_URI)
  await Blog.deleteMany({})
  await new Blog(blogsLists[0]).save()
  await new Blog(blogsLists[1]).save()
}, 1000000)
describe('When there are already saved blogs', () => {
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
})
describe('Adding and verifying new blog and its field', () => {
  test('id shoud be defined in database', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map((content) => content)
    for (let content of contents) {
      expect(content.id).toBeDefined()
    }
  })
  test('should add a valid blog to the database', async () => {
    const newBlog = {
      title: 'Super Test',
      author: 'Shailendra',
      link: 'https:link/shailendra/testing',
      likes: 20,
    }
    await api.post('/api/blogs').send(newBlog).expect(201)
    const allblogs = await api.get('/api/blogs')
    expect(allblogs.body).toHaveLength(blogsLists.length + 1)
    const blogs = allblogs.body.map((blog) => blog.title)
    expect(blogs).toContain('Super Test')
  })
})
describe('When field(s) of blog(s) are missing', () => {
  test('should check the likes property is assigned and default value is 0', async () => {
    const newBlog = {
      title: 'Super Test',
      author: 'Shailendra',
      link: 'https:link/shailendra/testing',
    }
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    const blogFindById = await api.get(`/api/blogs/${response.body.id}`)
    const parseBlog = await JSON.parse(JSON.stringify(blogFindById.body))
    expect(parseBlog).toHaveProperty('likes', 0)
  })
  test('blogs should have title or url properties', async () => {
    const newBlog = {
      author: 'shailendra',
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
