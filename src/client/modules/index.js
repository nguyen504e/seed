import ErrorPage from './error/ErrorPage';
import auth from './auth';

import app from './app'
import logout from './logout'
import admin from './admin';
import { default as CommonLoader, Route } from '../common/CommonLoader';
import { AppChannel, GlobalChannel } from '../services/radioService';

class ModulesLoader extends CommonLoader {

  initialize() {
    GlobalChannel.reply('nav:home', () => this.redirect('/app'))
  }

  @Route('/')
  routerRoot() {
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

export default [app, auth, admin, logout, ModulesLoader]
