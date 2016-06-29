import ErrorPage from './error/ErrorPage';

import app from './app'
import { default as CommonLoader, Route } from '../common/CommonLoader';
import { AppChannel } from '../services/radioService';

class ModulesLoader extends CommonLoader {

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

    return this.redirect('/app/dashboard')
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

export default [app, ModulesLoader]
