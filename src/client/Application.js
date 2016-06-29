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
  onShowPage(PageView, next) {
    this._showPage(PageView)
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

  _showPage(PageView) {
    if (!PageView) {
      return
    }
    if (isFunction(PageView)) {
      PageView = new PageView()
    }
    return this.showView(this.page = PageView)
  }
}

export default Application
