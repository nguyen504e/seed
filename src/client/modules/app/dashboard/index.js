import { default as CommonLoader, Route } from '../../../common/CommonLoader';
import { AppChannel } from '../../../services/radioService';

class DashboardLoader extends CommonLoader {
  load() {
    return System.import('./module')
  }

  @Route('/dashboard')
  onShowDashboard() {
    this.load().then(({View}) => AppChannel.request('show:content', new View()))
  }

}

export default DashboardLoader;
