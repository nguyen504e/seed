import { AppChannel } from '../../../services/radioService';
import { default as CommonView, RactiveTemplate, On } from '../../../common/CommonView';
import { delay } from 'lodash';
import authService from '../../../services/authService';

import SidebarTemplate from './Sidebar.html'

@RactiveTemplate({
  template: SidebarTemplate,
  subscribeModel: true
  })
class SidebarView extends CommonView {
    initialize() {
      AppChannel.reply('ui:sidebar:toggle', this.onToggleSidebar.bind(this))
      this.model = authService
    }

    @On()
    onToggleSidebar() {
      const $tmpl      = this.$tmpl
      const shouldShow = !$tmpl.get('isShow')

      this.updateTransition()

      $tmpl.set({
        isShow:   shouldShow,
        slideNum: shouldShow ? 0 : $tmpl.el.offsetWidth
      })
    }

    updateTransition() {
      this.$tmpl.set('transition', true)
      delay(() => this.$tmpl.set('transition', false), 500)
    }

    onDomRefresh() {}

    templateContext() {
      const {innerWidth, innerHeight} = window
      return {
        slideNum: (innerWidth - innerHeight > 0) ? innerWidth : innerHeight
      }
    }

    @On()
    onSlide(e) {
      if (e.original.deltaX > -1) {
        this.$tmpl.set('slideNum', e.original.deltaX)
      }
    }

    @On()
    onSlideCancel(e) {
      const $tmpl = this.$tmpl
      this.updateTransition()
      if (Number($tmpl.get('slideNum')) < e.node.offsetWidth / 2) {
        $tmpl.set('slideNum', 0)
      } else {
        this.onToggleSidebar()
      }
    }
  }

  export default SidebarView
