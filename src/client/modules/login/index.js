// import { RouterService, RegionService } from '../../services'
//
// export default function Loader() {
//   return System.import('./loader')
// }
//
// export const Controller = {
//   login() {
//     RegionService.autoShow(Loader)
//   }
// }
//
// RouterService.process(Controller)

import { default as CommonLoader, Route } from '../../common/CommonLoader';
import { AppChannel } from '../../services/radioService'

class LoginModule extends CommonLoader {
  load() {
    return System.import('./module')
  }

  @Route('app/login/*')
  login() {
    this.load().then(({View}) => AppChannel.request('show:content', new View()))
  }
}
