import path from 'path';

import mkdirp from 'mkdirp'

import Log from './log'

const logger = Log()

function errorHandler(err) {
  if (err) {
    logger.error(err)
  }
}

const _curPath = path.resolve(__dirname, '../') + '/'

export default {
  absPath(_path) {
    return _curPath + _path
  },

  mkdir(dirPath) {
    return mkdirp.sync(dirPath, errorHandler)
  }
}
