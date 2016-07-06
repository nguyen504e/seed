/**
 * Midware service for auth process
 */

import compose from 'composable-middleware'
import expressJwt from 'express-jwt'
import jwt from 'jsonwebtoken'

import profile from '../../profile'
import { Status, Permissions } from '../../constants'

import { User as UserModel } from '../../data/models'

const {expiresInMinutes, secrets} = profile
const validateJwt                 = expressJwt({secret: secrets.session})

class Auth {
  constructor() {}

  /**
   * Create midware to check auth info
   * @method checkAuth
   * @return {Function}       midware
   */
  checkAuth() {
    return compose().use(this._checkTokken).use(this._attachUser)
  }

  /**
   * Check tokken
   * Create headers auth from token
   * Validate token
   * @method _checkTokken
   * @param  {Object}    req  request
   * @param  {Object}    res  response
   * @param  {Function}  next forward callback
   * @return {Function}       midware
   */
  _checkTokken(req, res, next) {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token
    }
    validateJwt(req, res, next)
  }

  /**
   * Attaches the user object to the request if authenticated
   * Otherwise returns 403
   * @method _attachUser
   * @param  {Object}    req  request
   * @param  {Object}    res  response
   * @param  {Function}  next forward callback
   * @return {Promise}        Promise object
   */
  _attachUser(req, res, next) {
    return UserModel.findById(req.user._id)
      .populate('role', 'permission')
      .then(user => {
        if (user) {
          req.user = user
          return next()
        }

        return res.sendStatus(Status.UNAUTHORIZED)
      }, next)
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  hasPermission(permissionRequired) {
    if (!permissionRequired) {
      throw new Error('Required role needs to be set')
    }

    function meetsRequirements(req, res, next) {
      const permissionCode = Permissions[permissionRequired]
      if (permissionCode && req.user.role.permissions.indexOf(permissionCode)) {
        return next()
      }
      res.sendStatus(Status.FORBIDDEN)
    }

    return compose()
      .use(this.checkAuth)
      .use(meetsRequirements)
  }

  /**
   * Returns a jwt token signed by the app secret
   * @method signToken
   * @param  {String}  id token id
   */
  signToken(_id) {
    return jwt.sign({_id}, secrets.session, {
      expiresIn: expiresInMinutes + 'm'
    })
  }

  /**
   * Set token cookie directly for oAuth strategies
   * @method setTokenCookie
   * @param  {Object}       req request
   * @param  {Object}       res response
   */
  setTokenCookie(req, res) {
    if (!req.user) {
      return res.status(Status.NOT_FOUND).send({
        message: 'Something went wrong, please try again.'
      })
    }
    const token = this.signToken(req.user._id)
    res.cookie('token', JSON.stringify(token))
    return res.redirect('/')
  }
}

export default new Auth()
