import DashboardLoader from './dashboard';
import { default as CommonLoader, Route, Base, Children } from '../../common/CommonLoader'
import { AppChannel } from '../../services/radioService';

@Base('/app')
@Children(DashboardLoader)
class AppLoader extends CommonLoader {
  load() {
    return System.import('./module')
  }

  @Route('/*')
  routePage(ctx, next) {
    return this.load().then(({View}) => AppChannel.request('show:page', View, false, next))
  }
}

export default AppLoader;
