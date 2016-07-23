import { AppChannel, GlobalChannel } from '../services/radioService';

import { default as CommonLoader, Route } from '../common/CommonLoader';
import authService from '../services/authService';

class LogoutLoader extends CommonLoader {
  @Route('/logout')
  logout() {
    const modal = AppChannel.request('show:message', {
      content: 'Logout?'
    })
    modal.on('accept', () => {
      this.confirmLogout()
      GlobalChannel.request('nav:home')
    })
  }

  @Route('/logout/confirm')
  confirmLogout() {
    authService.clear()
  }
}

export default LogoutLoader;
