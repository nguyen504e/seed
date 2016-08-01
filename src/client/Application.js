import { Region } from 'backbone.marionette';
import { isFunction, mapValues } from 'lodash';

import MessageView from './components/MessageView';

import ApplicationTmpl from './Application.rac'
import Ractive from './common/lib/ractive';
import { default as CommonApplication, RadioRequests } from './common/CommonApplication'

class Application extends CommonApplication {
  get region() {
    return '#app-content'
  }

  _getViewInstance(View) {
    if (isFunction(View)) {
      return new View()
    }

    return View
  }

  onStart() {
    this.$tmpl = new Ractive({
      el:       document.querySelector('#page-content'),
      template: ApplicationTmpl
    })

    this.regions = mapValues({
      modal:   '#app-modal',
      message: '#app-message'
    }, selector => new Region({el: selector}))
  }

  @RadioRequests('show:page')
  onShowPage(PageView, forceReload, next) {
    if (this.page) {
      if (forceReload || this.page.constructor !== PageView.constructor) {
        this.page.destroy()
      }
    }

    this.page = this._getViewInstance(PageView)
    this.showView(this.page)

    if (next) {
      return next()
    }
  }

  @RadioRequests('show:content')
  onShowContent(view) {
    if (this.page && view) {
      view = this._getViewInstance(view)
      return this.page.showChildView('content', view)
    }
  }

  @RadioRequests('show:modal')
  onShowModal(view) {
    this.$tmpl.set('modal.active', true)
    this.regions.modal.show(view)
  }

  @RadioRequests('hide:modal')
  onHideModal(clean) {
    this.$tmpl.set('modal.active', false)
    if (false !== clean) {
      this.regions.modal.reset()
    }
  }

  @RadioRequests('show:message')
  onShowMessage(opts) {
    const msView = new MessageView(opts)
    this.regions.message.show(msView)
    this.$tmpl.set('message.active', true)
    return msView
  }

  @RadioRequests('hide:message')
  onHideMessage() {
    this.$tmpl.set('message.active', false)
    this.regions.message.reset()
  }

}

export default Application
