import express from 'express'
import { Status } from '../../constants';

import AuthController from './auth'
import UserController from './UserController'

// import ThingController from './thing'

export default express.Router()
  .use('/user', UserController)
  .use('/auth', AuthController)
  .use('*', (req, res) => res.sendStatus(Status.NOT_FOUND))
