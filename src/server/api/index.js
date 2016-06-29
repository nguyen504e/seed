import express from 'express'

import AuthController from './auth'
import UserController from './UserController'

// import ThingController from './thing'

export default express.Router()
  .use('/user', UserController)
  .use('/auth', AuthController)
