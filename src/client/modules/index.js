import ErrorPage from './error/ErrorPage';
import auth from './auth';

import app from './app'
import { default as CommonLoader, Route } from '../common/CommonLoader';
import { AppChannel, GlobalChannel } from '../services/radioService';

class ModulesLoader extends CommonLoader {

  initialize() {
    GlobalChannel.reply('nav:home', () => this.redirect('/app'))
  }

  @Route('/')
  routerRoot() {
    const meta = document.head.querySelector('meta[base-request]')
    if (meta) {
      const baseRequest = atob(meta.getAttribute('base-request'))
      meta.remove()
      if (baseRequest) {
        return this.redirect(baseRequest)
      }
    }

    return this.redirect('/app')
  }

  @Route('/notfound')
  errorPage() {
    AppChannel.request('show:page', new ErrorPage(404))
  }

  @Route('*')
  routerNotFound() {
    this.redirect('/notfound')
  }

}

export default [app, auth, ModulesLoader]
