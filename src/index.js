/**
 * Bootstrap file to run server
 */

import log4js from 'log4js'

import profile from './profile'
import Server from './server'
import { Log } from './utils'

const {port, ip, profileName} = profile
const logger                  = Log()

// Log on exit
process.on('exit', () => {
  logger.info('Stopping express server ( PID:' + process.pid + ')')
})

process.on('message', cmd => {
  if (cmd === 'FLUSH') {
    log4js.shutdown(() => {
    })
  }
})

// // Create http server
const server = new Server()
server.listen(port, ip, () => {
  logger.info('Express server listening on %d, in %s mode', port, profileName)
})
