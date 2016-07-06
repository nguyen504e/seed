
import { AppChannel } from '../../../services/radioService';
import { default as CommonLoader, Route } from '../../../common/CommonLoader';

class DashboardLoader extends CommonLoader {
  load() {
    return System.import('./module')
  }

  @Route('')
  home() {
    return this.navigate('/dashboard')
  }

  @Route('/dashboard')
  onShowDashboard() {
    return this.load().then(({View}) => AppChannel.request('show:content', View))
  }

}

export default DashboardLoader;
