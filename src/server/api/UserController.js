import jwt from 'jsonwebtoken'

import { Methods } from '../../constants'
import profile from '../../profile'
import { Auth } from '../services'
import { default as CommonController, Controller } from '../common/CommonController'
import { User as UserModel } from '../../data/models'

const {secrets, expiresInMinutes} = profile

// import socketio from '../socketio'
// socketio.then(socket => {
//   UserModel.schema.post('save', doc => {
//     socket.emit('user:save', doc)
//   })
//   UserModel.schema.post('remove', doc => {
//     socket.emit('user:remove', doc)
//   })
// })

class UserController extends CommonController {

  /**
   * Get list of users
   * restriction: 'admin'
   */
  @Controller('/', Methods.GET, [Auth.hasPermission('admin')])
  index(req, res) {
    const promise = UserModel.find({}, '-salt -hashedPassword').exec()
    return this._returnUser(res, promise)
  }

  /**
   * Deletes a user
   * restriction: 'admin'
   */
  @Controller('/:id', Methods.DELETE, [Auth.hasPermission('admin')])
  destroy(req, res) {
    return UserModel.findByIdAndRemove(req.params.id)
      .then(() => this._noContent(res))
      .catch(err => this._serverError(res, err))
  }

  /**
   * Get my info
   */
  @Controller('/me', Methods.GET, [Auth.checkAuth()])
  me(req, res) {
    const promise = UserModel.findOne({_id: req.user._id}, '-salt -hashedPassword').exec()
    return this._returnUser(res, promise)
  }

  /**
   * Change a users password
   */
  @Controller('/:id/password', Methods.PUT, [Auth.checkAuth()])
  changePassword(req, res) {
    const userId  = req.user._id
    const oldPass = String(req.body.oldPassword)
    const newPass = String(req.body.newPassword)

    return UserModel.findById(userId)
      .then(user => {
        if (user.authenticate(oldPass)) {
          user.password = newPass

          return user.save()
            .then(() => this._ok(res))
            .catch(err => this._unprocessableEntity(res, err))
        }

        this._forbidden(res)
      })
      .catch(err => this._serverError(res, err))
  }

  /**
   * Get a single user
   */
  @Controller('/:id', Methods.GET, [Auth.checkAuth()])
  show(req, res) {
    const promise = UserModel.findById(req.params.id)
    return this._returnUser(res, promise)
  }

  /**
   * Creates a new user
   */
  @Controller('/', Methods.POST)
  create(req, res) {
    const newUser = new UserModel(req.body)
    newUser.provider = 'local'
    newUser.role     = 'user'

    return newUser
      .save()
      .then(user => {
        const token = jwt.sign({_id: user._id}, secrets.session, {
          expiresInMinutes
        })

        res.json({token})
      })
      .catch(err => this._serverError(res, err))
  }

  _returnUser(res, promise) {
    return promise
      .then(user => {
        if (user) {
          return res.json(user.profile)
        }
        return this._unauthorized(res)
      })
      .catch(err => this._serverError(res, err))
  }
}

export default UserController
