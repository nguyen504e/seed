import { Log } from '../../utils';

import express from 'express'
import { bind, each } from 'lodash'

import profile from '../../profile'
import { Status } from '../../constants'

const logger = Log()

export function Controller(endpoint, method, midware) {
  return function(target, name) {
    const routerDef = target.__routerDefinition = target.__routerDefinition || []
    routerDef.push({
      endpoint,
      method,
      midware,
      name
    })
  }
}

class CommonController {

  constructor() {
    if (!this.__routerDefinition) {
      return
    }

    const routers = express.Router()

    /**
     * Create express routers from __routerDefinition
     * @param  {Object} route define of router
     */
    each(this.__routerDefinition, route => {
      const args = route.midware || []
      args.unshift(route.endpoint)
      args.push(bind(this[route.name], this))
      routers.use(...args)
    })

    return this.routers = routers
  }

  _unprocessableEntity(res, err) {
    if (err) {
      logger.error(err.message || err)
    }

    if (profile.profileName === 'production') {
      err = 'Unprocessable entity'
    }

    return res.status(Status.UNPROCESSABLE_ENTITY).send(err)
  }

  _serverError(res, err) {
    if (err) {
      logger.error(err.message || err)
    }

    if (profile.profileName === 'production') {
      err = 'Server error'
    }
    return res.status(Status.SERVER_ERROR).send(err)
  }

  _returnModel(res, err, model) {
    const isMissing = this.missingModel(res, err, model)
    return isMissing ? isMissing : res.send(model)
  }

  _createdModel(res, err, model) {
    if (err) {
      return this._serverError(res, err)
    }
    return res.status(Status.CREATED).send(model)
  }

  _deletedModel(res, err) {
    if (err) {
      return this._serverError(res, err)
    }
    return res.sendStatus(Status.NO_CONTENT)
  }

  _missingModel(res, err, model) {
    if (err) {
      return this._serverError(res, err)
    }
    if (!model) {
      return res.sendStatus(Status.NOT_FOUND)
    }
  }
}

export default CommonController
