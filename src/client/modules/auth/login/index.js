import { default as CommonLoader, Route } from '../../../common/CommonLoader';
import { AppChannel, AuthChannel } from '../../../services/radioService'

class LoginLoader extends CommonLoader {

  initialize() {
    AuthChannel.reply('login', () => this.navigate('/login'))
  }

  load() {
    return System.import('./module')
  }

  @Route('')
  home() {
    return this.navigate('/Login')
  }

  @Route('/login')
  login() {
    this.load().then(({View}) => AppChannel.request('show:content', View))
  }
}

export default LoginLoader
