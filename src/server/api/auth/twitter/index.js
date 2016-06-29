import express from 'express'

import { Auth } from '../../../services'
import Passport from './twitter.passport'

const controller = Passport.authenticate('twitter', {
  failureRedirect: '/signup',
  session:         false
})

export default express.Router()
  .get('/', controller)
  .get('/callback', controller, () => Auth.setTokenCookie(arguments))
