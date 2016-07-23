import url from 'url';

import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import errorHandler from 'errorhandler'
import express from 'express'
import fs from 'fs';
import log4js from 'log4js'
import passport from 'passport'
import serveStatic from 'serve-static'
import Mongoose from 'mongoose'

import profile from '../profile'
import ApiController from './api'
import { Log, Fs } from '../utils'

const {profileName, staticPath} = profile
const logger                    = Log()

logger.info('run profile: %s', profileName)

// TODO: remove in next version of mongoose
Mongoose.Promise = global.Promise

class Server {
  constructor() {
    this.app        = express()
    this.staticPath = Fs.absPath(staticPath)
    this.initMidware()
  }

  listen() {
    return this.app.listen(...arguments)
  }

  getTextFile(pth) {
    return fs.readFileSync(this.staticPath + pth).toString()
  }

  initMidware() {
    // handle error on dev and test mode
    if (profileName === 'devlopment') {
      this.app.use(errorHandler())
    }

    // enabling CORS
    const corsMidware = cors()
    this.app.use(corsMidware)
    this.app.options('*', corsMidware)

    // compress response bodies for all request
    this.app.use(compression())

    // body parsing
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({extended: false}))

    // Create passport
    this.app.use(passport.initialize())

    // Log
    this.app.use(log4js.connectLogger(logger, {
      level:  'auto',
      format: ':method :url :status :response-time ms'
    }))

    // api endpoint
    this.app.use('/api', ApiController)

    this.app.use(serveStatic(this.staticPath))
    this.app.get('*', (req, res) => {
      const jsReg = /\/.*?\/.*?\.js$/
      const path  = url.parse(req.originalUrl).pathname
      res.send(this.getTextFile(jsReg.test(path) ? path.split('/').pop() : 'index.html'))
    })
  }
}

export default Server
