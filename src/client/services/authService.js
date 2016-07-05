import CommonModel from '../common/CommonModel';

import historyService from './historyService'
import Config from '../config'

class AuthService extends CommonModel {
  getUrl(postFix) {
    return '/api/auth/' + postFix
  }

  initialize() {
    this._storage = Config.webStorage === 'local' ? localStorage : sessionStorage
    this.set(this.getAuth(), {silent: true})
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

  getAuth() {
    try {
      return JSON.parse(this._storage.getItem('auth') || '{}')
    } catch (e) {
      this._storage.removeItem('auth')
      return {}
    }
  }

  setAuth(data) {
    this._storage.setItem('auth', data)
  }

  login(data) {
    return this.save(data, {url: this.getUrl('local')})
  }

  parse(res) {
    const data = Object.assign(this.getAuth(), res)
    this.setAuth(JSON.stringify(data))
    return res
  }
}

export default new AuthService()
