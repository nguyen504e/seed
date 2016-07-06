import Passport from 'passport';

import express from 'express'
import { Auth } from '../../../services'
import { Status } from '../../../../constants'
import './local.passport'

const controller = function(req, res) {
  const strategy = function(err, user, info) {
    const error = err || info
    if (error) {
      return res.status(Status.NOT_ACCEPTABLE).send(error)
    }
    if (!user) {
      return res.status(Status.NOT_FOUND).send({
        message: 'Something went wrong, please try again.'
      })
    }

    return res.status(Status.OK).send({
      token: Auth.signToken(user._id),
      _id:   user._id,
      role:  user.role
    })
  }

  return Passport.authenticate('local', strategy)(req, res)
}

export default express.Router()
  .post('/', controller)
