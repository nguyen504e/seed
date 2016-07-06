import page from 'page';
import { isFunction } from 'lodash';

import { default as CommonApplication, RadioRequests } from './common/CommonApplication'

class Application extends CommonApplication {
  get region() {
    return '#page-content'
  }

  get channelName() {
    return 'app'
  }

  onStart() {
    page({dispatch: false})
    page.redirect(window.location.pathname)
  }

  @RadioRequests('show:page')
  onShowPage(PageView, forceReload, next) {
    if (PageView) {
      if (isFunction(PageView)) {
        PageView = new PageView()
      }

      if (forceReload !== false || !this.page || this.page.constructor !== PageView.constructor) {
        this.showView(this.page = PageView)
      }
    }

    if (next) {
      return next()
    }
  }

  @RadioRequests('show:content')
  onShowContent(view) {
    if (this.page && view) {
      if (isFunction(view)) {
        view = new view()
      }

      return this.page.showChildView('content', view)
    }
  }
}

export default Application
