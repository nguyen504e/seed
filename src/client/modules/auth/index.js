import { default as CommonLoader, Route, Base, Children } from '../../common/CommonLoader'
import { AppChannel } from '../../services/radioService';
import Login from './login';

@Base('/auth')
@Children(Login)
class AppLoader extends CommonLoader {

  load() {
    return System.import('./module')
  }

  @Route('*')
  routePage(ctx, next) {
    this.load().then(({View}) => AppChannel.request('show:page', View, false, next))
  }
}

export default AppLoader;
