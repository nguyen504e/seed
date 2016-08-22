import page from 'page';

import config from './config';

import Application from './Application'
// import Modules from './modules'
import { default as CommonLoader, Children } from './common/CommonLoader'
import { default as CommonRouter, Route } from './common/CommonRouter'
import history from './common/CommonHistory'

import backbone from 'backbone'

import pathToRegx from 'path-to-regexp'
class RouterHome extends CommonRouter {
  @Route('home/*')
  home(next) {
    next()
  }
}

class RouterHouse extends CommonRouter {
  @Route('home/house')
  house() {
    console.log('house')
  }
}

new RouterHome()
new RouterHouse()

history.start()

// @Children(Modules)
class ApplicationLoader extends CommonLoader {
  constructor() {
    super()
  }

  load() {
    function themeLoader() {
      switch (config.theme) {
        default:
           return System.import('./styles/Original/index.scss')
      }
    }

    return new Promise((resolve, reject) => {
      return themeLoader().then(css => resolve({css}), reject)
    })
  }

  start() {
    // return this.load().then(() => {
    //   const app = new Application()
    //   app.start()
    //   page({dispatch: false})
    //   page.redirect(window.location.pathname)
    // })
  }
}

export default ApplicationLoader
