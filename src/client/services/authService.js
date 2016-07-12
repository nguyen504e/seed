import CommonModel from '../common/CommonModel';

import historyService from './historyService'
import Config from '../config'

class AuthService extends CommonModel {
  getUrl(postFix) {
    return '/api/auth/' + postFix
  }

  initialize() {
    this._storage = Config.webStorage === 'local' ? localStorage : sessionStorage
    this.set(this.parse(this.getAuth()))
  }

  // isLogin() {}

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
    return this.save(data, {url: this.getUrl('local')}).then(res => {
      this.setAuth(JSON.stringify(res))
    })
  }

  parse(res) {
    res.isLogin = !!res.token
    return res
  }
}

export default new AuthService()
