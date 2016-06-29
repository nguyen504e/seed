import express from 'express'

import { Auth } from '../../../services'
import Passport from './google.passport'

const failureRedirect = '/signup'
const session         = false
const scope           = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
]

export default express.Router()
  .get('/', Passport.authenticate('google', {
    failureRedirect,
    session,
    scope
  }))
  .get('/callback', Passport.authenticate('google', {
    failureRedirect,
    session
  }), () => Auth.setTokenCookie(arguments))
