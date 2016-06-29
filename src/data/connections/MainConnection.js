import mongoose from 'mongoose'

import { Log } from '../../utils';
import profile from '../../profile'

const logger = Log('db')

// Connect to database
const connection = mongoose.createConnection(profile.mongo.uri, profile.mongo.options)

connection.on('error', err => {
  logger.error('MongoDB connection error: %s', err.message)
})

const logLevel = profile.mongo.logLevel

/**
 * Set log level for mongoose
 * Only support info, debug, error
 */
if (['info', 'debug', 'error'].indexOf(logLevel) > -1) {
  /**
   * Use log4js in mongoose
   * Apply style for docs return from query
   */
  mongoose.set(logLevel, (collectionName, method, query, doc) => {
    logger[logLevel](collectionName, method + '\n', query, doc || '')
  })
}

export default connection
