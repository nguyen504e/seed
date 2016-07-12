import { default as CommonView, RactiveTemplate, On } from '../../../common/CommonView';
import authService from '../../../services/authService';
import { AppChannel } from '../../../services/radioService';

import NavbarViewTmpl from './NavbarView.html'

@RactiveTemplate({
  template: NavbarViewTmpl,
  subscribeModel: true
  })
class NavbarView extends CommonView {

    initialize() {

      let waiting       = false
      const onNavScroll = this.onNavScroll.bind(this)

      const scrollhandler = () => {
        if (waiting) {
          return
        }
        waiting = true

        // clear previous scheduled endScrollHandle
        // clearTimeout(endScrollHandle)

        onNavScroll()

        setTimeout(function() {
          waiting = false
        }, 100)
      }

      window.addEventListener('scroll', scrollhandler)
      this.on('detach', () => window.removeEventListener('scroll', scrollhandler))

      this.model = authService
    }

    onNavScroll() {
      if (window.scrollY >= window.innerHeight - 60) {
        return this.classList.remove('transparent')
      }
      return this.classList.add('transparent')
    }

    onAttach() {
      this.classList = this.el.children[0].classList
    }

    @On()
    onToggleSidebar() {
      AppChannel.request('ui:sidebar:toggle')
      return false
    }
  }

  export default NavbarView
