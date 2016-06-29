import async from 'async';

import profile from '../../profile';

import { map, forEach } from 'lodash'

import log from '../../utils/log'
import RoleModel from '../../api/role/role.model'
import UserModel from '../../api/user/user.model'
import { Json, Fs } from '../utils'

const parseDataTasks = {}
const resetDbTasks   = []
const logger         = log('dbSeed')
const models         = {role: RoleModel, user: UserModel}

forEach(models, (Model, key) => {
  parseDataTasks[key] = function(done) {
    return Json.jsonFromCvsFile(Fs.absPath(`data/init/${profile.profileName}/${key}.csv`))
      .then(res => done(null, res))
      .catch(done)
  }

  resetDbTasks.push(function(done) {
    return Model.find({}).remove(done)
  })
})

const createPopularTasks = function(datas) {
  return map(datas, (data, name) => {
    return function(done) {
      const Model = models[name]
      return Model.create(data, err => done(err))
    }
  })
}

const errorHandler = function(err) {
  if (err) {
    logger.error(err)
    return false
  }

  return true
}

async.parallel(parseDataTasks, (err, res) => {
  if (errorHandler(err)) {
    logger.info('Finish parse data')
    async.parallel(resetDbTasks, err => {
      if (errorHandler(err)) {
        logger.info('Finish clean db')
        async.waterfall(createPopularTasks(res), (err, res) => {
          if (errorHandler(err, res)) {
            process.send({completed: true})
          } else {
            process.send({completed: false, error: err})
          }
        })
      }
    })
  }
})
