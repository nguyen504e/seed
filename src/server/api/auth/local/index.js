import express from 'express'

import { Auth } from '../../../services'
import Passport from './local.passport'
import { Status } from '../../../../constants'

const controller = function(req, res) {
  const strategy = function(err, user, info) {
    const error = err || info
    if (error) {
      return res.json(Status.UNAUTHORIZED, error)
    }
    if (!user) {
      return res.json(Status.NOT_FOUND, {
        message: 'Something went wrong, please try again.'
      })
    }

    res.json({token: Auth.signToken(user._id, user.role)})
  }
  return Passport.authenticate('local', strategy)
}

export default express.Router()
  .post('/', controller)
