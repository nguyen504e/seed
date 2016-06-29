import crypto from 'crypto'
import mongoose from 'mongoose'
import { isArray } from 'lodash'

import { Messages, AuthTypes } from '../../constants'

const checkAuthTypes = provider => ~AuthTypes.indexOf(provider)
const UserSchema     = new mongoose.Schema({
  name:  String,
  email: {
    type:      String,
    lowercase: true
  },
  role: {
    type:    String,
    ref:     'Role',
    default: 'USER'
  },
  hashedPassword: String,
  provider:       String,
  salt:           String,
  facebook:       {},
  twitter:        {},
  google:         {},
  github:         {}
})

/**
 * Virtuals
 */

/*eslint no-invalid-this: 0 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password      = password
    this.salt           = this.makeSalt()
    this.hashedPassword = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {name: this.name, role: this.role}
  })

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {_id: this._id, role: this.role}
  })

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return checkAuthTypes(this.provider) ? true : email.length
  }, Messages.required('Email'))

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return checkAuthTypes(this.provider) ? true : hashedPassword.length
  }, Messages.required('Password'))

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    return this.constructor.findOne({email: value})
      .exec()
      .then((err, user) => respond(user ? (this.id === user.id) : true))
      .catch(err => {
        throw err
      })
  }, Messages.inUsed('Email'))

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew || isArray(this.hashedPassword) || !checkAuthTypes(this.provider)) {
      return next()
    }
    return next(new Error('Invalid password'))
  })

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt() {
    const LENGTH = 16
    return crypto.randomBytes(LENGTH).toString('base64')
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword(password) {
    const ITERATIONS = 10000
    const KEYLEN     = 64

    if (!password || !this.salt) {
      return ''
    }

    const buffer = new Buffer(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, buffer, ITERATIONS, KEYLEN).toString('base64')
  }
}

export default UserSchema
