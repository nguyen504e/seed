import { View } from 'backbone.marionette'
import { isObject, isFunction, result, each } from 'lodash'

import Ractive from './lib/ractive';
import { SetHash, SetProp } from './lib/decorators'

class CommonView extends View {
  constructor() {
    super(...arguments)
    this._ractiveHandleModelChange = (model, options) => {
      if (options.ractiveSilent) {
        return
      }
      return this.$tmpl.set(model.changed)
    }
  }

  _renderTemplate() {
    if (this.ractiveTemplate) {
      const template = this.getOption('ractiveTemplate')
      if (!isFunction(template) && isObject(template)) {
        let $tmpl = this.$tmpl
        $tmpl && $tmpl.teardown()

        template.data = this.mixinTemplateContext(this.serializeData())
        template.el   = this.el

        $tmpl = new Ractive(template)

        if (template.subscribeModel && this.model) {
          const model = this.model
          if (!template.lazy) {
            $tmpl.on('change', changed => {
              this.model.set(changed, {ractiveSilent: true})
            })
          }

          model.off('change', this._ractiveHandleModelChange)
          model.on('change', this._ractiveHandleModelChange)
        }

        this.$tmpl = $tmpl
        return this.delegateRactiveEvents()
      }
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
      return method && $tmpl.on(key, method.bind(this))
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

export function ModelClass(Model) {
  return SetProp('model', new Model(), true)
}

export function RactiveTemplate(template) {
  if (isObject(template)) {
    if (template.template) {
      template = Object.assign({
        lazy:           true,
        subscribeModel: false
      }, template)
    } else {
      template = {lazy: true, subscribeModel: false, template}
    }
  } else {
    return new Error('Decorator do not accept this type of template')
  }
  return SetProp('ractiveTemplate', template, true)
}

export function TagName(value) {
  return SetProp('tagName', value, true)
}

export function Id(value) {
  return SetProp('id', value, true)
}

export function ClassName(value) {
  return SetProp('className', value, true)
}

export function Regions(value) {
  return SetProp('regions', value, true)
}
