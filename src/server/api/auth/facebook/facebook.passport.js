import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import profile from '../../../../profile'

import { User as UserModel } from '../../../../data/models'

const {facebook} = profile

const createUser = function(accessToken, refreshToken, profile, done) {
  return UserModel.findOne({'facebook.id': profile.id})
    .exec()
    .then(user => {
      if (user) {
        return done(null, user)
      }

      user = new UserModel({
        role:     'user',
        provider: 'facebook',
        name:     profile.displayName,
        email:    profile.emails[0].value,
        username: profile.username,
        facebook: profile._json
      })

      return user.save().then(() => done(null, user), done)

    }, done)
}

export default passport.use(new FacebookStrategy({
  clientID:     facebook.clientID,
  clientSecret: facebook.clientSecret,
  callbackURL:  facebook.callbackURL
}, createUser))
