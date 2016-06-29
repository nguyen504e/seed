import CommonModel from '../../common/CommonModel'

class LoginModel extends CommonModel {

  get restUrlRoot() {
    return '/api/auth/local'
  }

  login(data) {
    this.set(data)
    this.save()
  }
}

export default LoginModel
