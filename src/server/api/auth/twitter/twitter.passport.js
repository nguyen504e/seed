import passport from 'passport'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import profile from '../../../../profile'

import { User as UserModel } from '../../../../data/models'
const {twitter} = profile

const saveSession = function(token, tokenSecret, profile, done) {
  return UserModel.findOne({'twitter.id_str': profile.id})
    .exec()
    .then(user => {
      if (user) {
        return done(null, user)
      }

      user = new UserModel({
        provider: 'twitter',
        role:     'user',
        name:     profile.displayName,
        username: profile.username,
        twitter:  profile._json
      })

      return user.save().then(() => done(null, user), done)
    }, done)
}

export default passport.use(new TwitterStrategy({
  consumerKey:    twitter.clientID,
  consumerSecret: twitter.clientSecret,
  callbackURL:    twitter.callbackURL
}, saveSession))
