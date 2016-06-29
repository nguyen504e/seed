import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { User as UserModel } from '../../../../data/models'
const checkUser = function(email, password, done) {
  return UserModel.findOne({email: email.toLowerCase()})
    .exec()
    .then(user => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        })
      }

      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        })
      }

      return done(null, user)
    }, done)
}

export default passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password' // this is the virtual field on the model
}, checkUser))
