const config = require('../utils/config')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const usersList = [
  {
    name: 'Dilip Poudel',
    username: 'dilip123',
    password: 'abcde',
  },
  {
    name: 'Ram Poudel',
    username: 'ram123',
    password: 'abcde',
  },
]
beforeEach(async () => {
  await mongoose.connect(config.MONGODB_URI)
  await User.deleteMany({})
  await new User(usersList[0]).save()
  await new User(usersList[1]).save()
}, 5000000)
describe('when there are already saved users', () => {
  test('total number of users should be initial length of userslist', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(usersList.length)
  })
  test('users should return as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})
describe('add new users and and validate users', () => {
  test('add new user to the database', async () => {
    const newUser = {
      name: 'Hari Prasad',
      username: 'hari123',
      password: 'prasad123',
    }
    await api.post('/api/users').send(newUser).expect(201)
    const allUsers = await api.get('/api/users')
    expect(allUsers.body).toHaveLength(usersList.length + 1)
    const users = allUsers.body.map((user) => user.username)
    expect(users).toContain('hari123')
  })
  test('invalid users couldnot save to database', async () => {
    const newUser = {
      name: 'Hari Prasad',
      username: 'ha',
      password: 'hari123',
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body).toEqual({
      error: 'username or password must be at least 3 chars long',
    })
    const usersInTable = await api.get('/api/users')
    expect(usersInTable.body.length).toBe(usersList.length)
  })
  test('invalid password couldnot save to database', async () => {
    const newUser = {
      name: 'Hari Prasad',
      username: 'hari123',
      password: 'ha',
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body).toEqual({
      error: 'username or password must be at least 3 chars long',
    })
    const usersInTable = await api.get('/api/users')
    expect(usersInTable.body.length).toBe(usersList.length)
  })
  test('username must be unique', async () => {
    const oldUser = {
      name: 'Hari Prasad',
      username: 'hari123',
      password: 'hari',
    }
    await api.post('/api/users').send(oldUser).expect(201)
    const usersInTable = await api.get('/api/users')
    const usernames = usersInTable.body.map((user) => user.username)
    expect(usernames).toContain('hari123')

    expect(usersInTable.body.length).toBe(usersList.length + 1)
    const newUser = {
      name: 'Prasad hari',
      username: 'hari123',
      password: '123hari',
    }
    const newResponse = await api.post('/api/users').send(newUser).expect(400)
    expect(newResponse.body).toEqual({ error: 'username must be unique' })
  })
})
afterAll(async () => {
  mongoose.connection.close()
})
