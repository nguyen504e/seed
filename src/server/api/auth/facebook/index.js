import express from 'express'

import { Auth } from '../../../services'
import passport from './facebook.passport'

export default express.Router()
  .get('/', passport.authenticate('facebook', {
    scope: [
      'email',
      'user_about_me'
    ],
    failureRedirect: '/signup',
    session:         false
  }))
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup',
    session:         false
  }), () => Auth.setTokenCookie(arguments))
