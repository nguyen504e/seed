import { Status } from '../constants';

import bodyParser from 'body-parser'
import compression from 'compression'
import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import errorHandler from 'errorhandler'
import express from 'express'
import expressSession from 'express-session'
import fs from 'fs';
import log4js from 'log4js'
import methodOverride from 'method-override'
import passport from 'passport'
import serveStatic from 'serve-static'
import Mongoose from 'mongoose'

import profile from '../profile'
import ApiController from './api'
import { Log, Fs } from '../utils'

const {profileName, secrets, staticPath} = profile
const logger                             = Log()

logger.info('run profile: %s', profileName)

// TODO: remove in next version of mongoose
Mongoose.Promise = global.Promise

class Server {
  constructor() {
    const SessionStore = connectRedis(expressSession)

    this.app     = express()
    this.session = expressSession({
      store:             new SessionStore(),
      secret:            secrets.session,
      resave:            true,
      saveUninitialized: false
    })

    this.staticPath = Fs.absPath(staticPath)
    this.initMidware()
  }

  listen() {
    return this.app.listen(...arguments)
  }

  initMidware() {
    // handle error on dev and test mode
    if (profileName !== 'production') {
      this.app.use(errorHandler())
    }

    // enabling CORS
    this.app.use(cors())
    this.app.options('*', cors())

    // compress response bodies for all request
    this.app.use(compression())

    // body parsing
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({extended: false}))

    // To override the req.method property with a new value.
    // This value will be pulled from the provided getter
    this.app.use(methodOverride())

    // Parse Cookie header and populate req.cookies with an object keyed by the cookie names
    this.app.use(cookieParser())

    // Create passport
    this.app.use(passport.initialize())

    // Log
    this.app.use(log4js.connectLogger(logger, {
      level:  'auto',
      format: ':method :url :status :response-time ms'
    }))

    // enabling session
    this.app.use(this.session)

    // api endpoint
    this.app.use('/api', ApiController)

    // Static file serve
    this.app.get('/', (req, res, next) => {
      const originalUrl = req.session.originalUrl

      if (!originalUrl) {
        return next()
      }

      delete req.session.originalUrl

      const index = fs.readFileSync(this.staticPath + 'index.html').toString()
      const meta  = `<meta base-request="${originalUrl}">`
      return res.send(index.replace('<!-- [[base]] -->', meta))
    })

    this.app.use(serveStatic(this.staticPath))

    this.app.use((req, res) => {
      if (req.method === 'GET') {
        let originalUrl = req.originalUrl
        const paramIdx  = originalUrl.indexOf('?')
        if (paramIdx >= 0) {
          originalUrl = originalUrl.substr(0, paramIdx)
        }

        if (!/\.(\w+)$/.test(originalUrl)) {
          req.session.originalUrl = new Buffer(originalUrl).toString('base64')
          return res.redirect('/')
        }
      }

      return res.sendStatus(Status.NOT_FOUND)
    })
  }
}

export default Server
