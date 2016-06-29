import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import profile from '../../../../profile'

import { User as UserModel } from '../../../../data/models'
const {google} = profile

const saveSession = function(accessToken, refreshToken, profile, done) {
  return UserModel.findOne({'google.id': profile.id})
    .exec()
    .then(user => {
      if (user) {
        return done(null, user)
      }

      user = new UserModel({
        name:     profile.displayName,
        email:    profile.emails[0].value,
        username: profile.username,
        google:   profile._json,
        provider: 'google',
        role:     'user'
      })

      return user.save().then(() => done(null, user), done)
    }, done)

}

export default passport.use(new GoogleStrategy({
  clientID:     google.clientID,
  clientSecret: google.clientSecret,
  callbackURL:  google.callbackURL
}, saveSession))
