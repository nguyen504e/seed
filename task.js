/*eslint no-process-env: 0*/

const babel                    = require('babel-core')
const path                     = require('path')
const fs                       = require('fs')
const mkdirp                   = require('mkdirp')
const {delay, isString, chain} = require('lodash')

class AppInstance {
  constructor(path) {
    this.instance = {}
    this.path     = path
  }

  processCallback(callback) {
    if (callback) {
      callback()
    }
  }

  start(callback) {
    process.execArgv.push('--harmony')

    const fork = require('child_process').fork
    this.instance = fork(this.path, {
      silent: true,
      env:    {
        NODE_ENV: process.env.NODE_ENV
      }
    })

    this.instance.stdout.pipe(process.stdout)
    this.instance.stderr.pipe(process.stderr)
    this.instance.on('message', m => {
      if (m === 'KILLME') {
        this.stop()
      }
    })

    // logger.info('Starting express server ( PID:', this.instance.pid, ')')

    this.processCallback(callback)
  }

  stop(callback) {
    if (this.instance.connected) {
      this.instance.on('exit', () => this.processCallback(callback))
      this.instance.send('FLUSH')
      return delay(() => this.instance.kill('SIGINT'), 500)
    }
    this.processCallback(callback)
  }

  restart(done) {
    this.stop(() => {
      this.start(done)
    })
  }
}

class Task {
  constructor() {
    const log4js = require('log4js')
    log4js.configure({
      appenders: [
        {
          type:   'console',
          layout: {
            type:    'pattern',
            pattern: '%[%d{yyMMdd:hhmmss.SSS}:%-5p%][%-7c] %m'
          }
        }
      ]
    }, 'task')

    this.logger = log4js.getLogger('task')
  }

  initialize() {
    let profileName  = 'production'
    const profileIdx = process.argv.indexOf('--profile')
    if (profileIdx > -1) {
      profileName = process.argv[profileIdx + 1]
    }

    process.env.NODE_ENV = profileName

    if (process.argv.indexOf('--initdb') > -1) {
      this.initdb = true
    }

    this.logger.info('Run task in %s profile', profileName)

    this.isDevMode  = profileName === 'development'
    this.outputPath = this.isDevMode ? '.tmp/' : 'dest/'

    const webpack       = require('webpack')
    const webpackConfig = require('./webpack.config')

    this.clientCompiler         = webpack(webpackConfig)
    this.clientCompilerLogLevel = webpackConfig.logLevel

    this.babelConfig = {
      plugins: [
        'transform-es2015-modules-commonjs',
        'transform-object-rest-spread',
        'transform-decorators-legacy',
        'transform-class-properties',
        'transform-function-bind'
      ]
    }
  }

  sttHandle() {
    const logger    = this.logger
    const logLevel  = this.clientCompilerLogLevel
    const isDevMode = this.isDevMode

    return function(error, stats) {
      const jsonStats = stats.toJson()

      if (error) {
        return logger.error(error)
      }

      if (jsonStats.errors.length > 0) {
        return logger.error(jsonStats.errors.toString({
          colors: true
        }))
      }

      if (logLevel === 'warn' || logLevel === 'info') {
        if (jsonStats.warnings.length > 0) {
          return logger.warn(jsonStats.warnings)
        }
      }

      if (logLevel === 'info') {
        logger.info(stats.toString({colors: true}))
      }

      if (!isDevMode) {
        return logger.info('Complete!')
      }
    }
  }

  errHandle(err) {
    if (err) {
      return this.logger.error(err)
    }
  }

  tranform(sourcePath) {
    const destPath = path.resolve(__dirname, this.outputPath + sourcePath.replace(/^src\//, ''))
    const dirPath  = path.dirname(destPath)

    mkdirp.sync(dirPath, this.errHandle.bind(this))

    return fs.writeFile(destPath, babel.transformFileSync(sourcePath, this.babelConfig).code, this.errHandle.bind(this))
  }

  expandGlobs(filePaths) {
    const glob = require('glob')

    if (isString(filePaths)) {
      filePaths = [filePaths]
    }
    return filePaths.reduce(function(arr, file) {
      // if file path contains "magical chars" (glob) we expand it, otherwise we
      // simply use the file path
      if (glob.hasMagic(file)) {
        return arr.concat(glob.sync(file, {
          // we want to return the glob itself to report that it didn't find any
          // files, better to giver clear error messages than to fail silently
          nonull: true,
          nodir:  true
        }))
      }
      arr.push(file)
      return arr
    }, [])
  }

  exec() {
    return this.isDevMode ? this.execDev() : this.execProd()
  }

  execProd() {
    const tasks = chain(this.expandGlobs('src/**/*.js'))
      .filter(file => !file.match(/^src\/client\//))
      .map(file => () => this.tranform(file))
      .value()

    tasks.push(() => this.clientCompiler.run(this.sttHandle()))

    const async = require('async')
    async.parallel(tasks)
  }

  execDev() {
    this.clientCompiler.watch({aggregateTimeout: 500}, this.sttHandle())

    let serverInstance
    let dbInstance
    let startTime
    let waiting

    const runFile = () => {
      if (waiting) {
        return
      }

      if (startTime > (new Date()).getTime()) {
        function resc() {
          waiting = false
          runFile()
        }

        waiting = true

        return delay(resc, 1000)
      }

      if (this.initdb) {
        if (!dbInstance) {
          dbInstance = new AppInstance(this.outputPath + 'data/init/index.js')
        }

        dbInstance.instance.on('message', cmd => {
          cmd = cmd || ''
          if (cmd.completed) {
            return this.initdb = false
          }

          dbInstance.stop()
          return this.initdb = true
        })

        dbInstance.restart()
      }

      if (!serverInstance) {
        serverInstance = new AppInstance(this.outputPath + 'index.js')

        process.on('uncaughtException', err => {
          this.logger.error(err)
          serverInstance.stop()
        })

        serverInstance.start()
      } else {
        serverInstance.restart()
      }
    }

    const chokidar = require('chokidar')
    const watcher  = chokidar.watch('src/**/*.js', {
      ignored: [
        /[\/\\]\./,
        /^src\/client/
      ],
      persistent: true,
      // ignoreInitial: true,
      atomic: 3000
    })

    watcher.on('all', (even, _pth) => {
      this.logger.info('tranform file %s', _pth)
      this.tranform(_pth)
      startTime = (new Date()).getTime() + 3000
      return runFile()
    })
  }
}

const task = new Task()
task.initialize()
task.exec()
