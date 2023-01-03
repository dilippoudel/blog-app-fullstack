require('dotenv').config()
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' }).end()
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
const tokenExtractor = (request, response, next) => {
  let authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    authorization = authorization.substring(7)
    request.token = authorization
    next()
  }
  return null
}
const userExtractor = (request, response, next) => {
  const token = request.token
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(token, process.env.SECRET)
  const user = decodedToken.id
  request.user = user
  next()
}
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
