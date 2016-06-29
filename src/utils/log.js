import log4js from 'log4js'
import { each, assign } from 'lodash'
import Path from 'path'
import mkdirp from 'mkdirp'

import profile from '../profile'

const appenders = [{type:   'console',layout: profile.log.layout}]

each(assign({}, profile.log.appenders), (app, name) => {
  app.category = name
  app.layout   = app.layout || profile.log.layout
  app.filename = Path.resolve(__dirname, '../log/' + app.filename + '.log')
  mkdirp.sync(Path.dirname(app.filename))
  appenders.push(app)
})

log4js.configure({appenders})

const loggerCache = {}

export default function createLog(category) {
  if (!category || !profile.log.appenders[category]) {
    category = 'default'
  }

  if (loggerCache[category]) {
    return loggerCache[category]
  }

  const logger = log4js.getLogger(category)
  logger.setLevel(profile.log.level)
  return loggerCache[category] = logger
}
