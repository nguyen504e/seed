import { default as CommonLoader, Base, Children, Route } from '../../common/CommonLoader';
import DashboardLoader from './dashboard'
import { AppChannel } from '../../services/radioService';

@Base('/admin')
@Children(DashboardLoader)
class AdminLoader extends CommonLoader {
  load() {
    return System.import('./module')
  }

  @Route('/*')
  indexPage(ctx, next) {
    return this.load().then(({View}) => AppChannel.request('show:page', View, false, next))
  }
}

export default AdminLoader;
