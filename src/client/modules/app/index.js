import AppPage from './AppPage'
import DashboardLoader from './dashboard';
import { default as CommonLoader, Route, Base, Children } from '../../common/CommonLoader'
import { AppChannel } from '../../services/radioService';

@Base('/app')
@Children(DashboardLoader)
class AppLoader extends CommonLoader {
  @Route('*')
  routePage(ctx, next) {
    AppChannel.request('show:page', AppPage, false, next)
  }
}

export default AppLoader;
