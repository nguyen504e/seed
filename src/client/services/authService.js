import historyService from './historyService'
import Config from '../config'
import { CommonModel } from '../lib/common'

class AuthService extends CommonModel {
  get restUrlRoot() {
    return '/api/user/me'
  }

  initialize() {
    this._storage = Config.webStorage === 'local' ? localStorage : sessionStorage
    const auth = this._storage.getItem('auth')

    if (auth) {
      this.set(JSON.parse(auth), {silent: true})
    }
  }

  isLogin() {}

  // hasPermission(permissionRequired) {}

  acceptor(permissionRequired) {
    if (!permissionRequired) {
      throw new Error('Required role needs to be set')
    }

    const auth = this

    return function meetsRequirements(ctx, next) {
      if (!auth.isLogin()) {
        return historyService.naviagte(Config.path.login)
      }

      if (!auth.hasPermission(permissionRequired)) {
        return false
      }

      return next()
    }
  }

  getAuthInfo() {
    return this.fetch()
  }
}

export default AuthService
