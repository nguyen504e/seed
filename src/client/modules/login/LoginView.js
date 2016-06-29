import CommonView from '../../common/CommonView'
import LoginTemplate from './LoginTemplate.html'

class LoginView extends CommonView {

  get template() {
    return LoginTemplate
  }

  constructor() {
    super({events: {'submit #login-form': 'onLogin'}})
  }

  initialize() {}

  onShow() {}

  onLogin(e) {
    e.preventDefault()
  }
}

export default LoginView
