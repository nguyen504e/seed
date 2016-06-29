import { View } from 'backbone.marionette'
import { isObject, isFunction, result, each, bind } from 'lodash'

import Ractive from './lib/ractive';
import { SetHash, SetProp } from './lib/decorators'

class CommonView extends View {
  constructor() {
    super(...arguments)
  }

  _renderTemplate() {
    const template = this.getOption('template')

    if (!isFunction(template) && isObject(template)) {
      let $tmpl = this.$tmpl
      $tmpl && $tmpl.teardown()

      function handleModelChange(model) {
        return $tmpl.set(model.changed)
      }

      if (this.subscribeModel) {
        this.model.off('change', handleModelChange)
        this.model.on('change', handleModelChange)
      }

      $tmpl = new Ractive({
        el:   this.el,
        data: this.mixinTemplateContext(this.serializeData()),
              template
      })

      this.delegateRactiveEvents()
      return this.$tmpl = $tmpl
    }

    return View.prototype._renderTemplate(arguments)
  }

  delegateRactiveEvents(events) {
    const $tmpl = this.$tmpl

    if (!$tmpl) {
      return
    }

    events || (events = result(this, 'ractiveEvents'))
    if (!events) {
      return this
    }

    this.undelegateRactiveEvents()

    each(events, (method, key) => {
      if (!isFunction(method)) {
        method = this[method]
      }
      return method && $tmpl.on(key, bind(method, this))
    })

  }

  undelegateRactiveEvents(events) {
    const $tmpl = this.$tmpl
    if (!$tmpl) {
      return
    }

    if (events === true) {
      return $tmpl.off()
    }

    events || (events = result(this, 'ractiveEvents'))
    return each(events, selector => $tmpl.off(selector))
  }
}

export default CommonView

function _setRadio(type, propertiesName) {
  return SetHash(type, propertiesName, target => {
    if (!target.channelName) {
      target.channelName = 'global'
    }
  })
}

export function On(eventName) {
  return SetHash('ractiveEvents', eventName)
}

export function Events(eventName) {
  return SetHash('events', eventName)
}

export function RadioEvents(eventName) {
  return _setRadio('radioEvents', eventName)
}

export function RadioRequests(eventName) {
  return _setRadio('radioRequests', eventName)
}

export function Template(template) {
  return SetProp('template', template, true)
}

export function Regions(value) {
  return SetProp('regions', value, true)
}
