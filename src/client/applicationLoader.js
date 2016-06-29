import config from './config';
import Application from './Application'
import Modules from './modules'
import { default as CommonLoader } from './common/CommonLoader'

class ApplicationLoader extends CommonLoader {

  get children() {
    return Modules
  }

  load() {

    function themeLoader() {
      switch (config.theme) {
        case 'ceruclean':
          return System.import('./styles/themes/Ceruclean/index.scss')
        default:
          return System.import('./styles/themes/Original/index.scss')
      }
    }

    return new Promise((resolve, reject) => {
      Promise.all([themeLoader(), System.import('./styles/fontAwesome.scss')])
        .then(css => resolve({css: css.join(' ')}), reject)
    })
  }
}

new ApplicationLoader()
const app = new Application()
app.start()
