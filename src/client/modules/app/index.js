import AppPage from './AppPage'
import DashboardLoader from './dashboard';
import { default as CommonLoader, Route } from '../../common/CommonLoader'
import { AppChannel } from '../../services/radioService';

class AppLoader extends CommonLoader {

  get base() {
    return '/app'
  }

  get children() {
    return [DashboardLoader]
  }

  @Route('/*')
  routePage(ctx, next) {
    AppChannel.request('show:page', AppPage, next)
  }
}

export default AppLoader;
