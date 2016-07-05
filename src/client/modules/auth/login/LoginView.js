import { default as CommonView, RactiveTemplate, On, ModelClass } from '../../../common/CommonView';
import LoginModel from './LoginModel';
import { GlobalChannel } from '../../../services/radioService'
import LoginTemplate from './LoginView.html'

@RactiveTemplate({
  template: LoginTemplate,
  subscribeModel: true,
  lazy:           false
  })
@ModelClass(LoginModel)
class LoginView extends CommonView {
    @On()
    onLogin() {
      this.model.login().then(() => GlobalChannel.request('nav:home'))
      return false
    }
  }

  export default LoginView
