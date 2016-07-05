import config from './config';
import Application from './Application'
import Modules from './modules'
import { default as CommonLoader, Children } from './common/CommonLoader'

@Children(Modules)
class ApplicationLoader extends CommonLoader {
  load() {

    function themeLoader() {
      switch (config.theme) {
        default:
           return System.import('./styles/Original/index.scss')
      }
    }

    return new Promise((resolve, reject) => {
      themeLoader().then(css => resolve({css}), reject)
    })
  }
}

new ApplicationLoader()
const app = new Application()
app.start()
