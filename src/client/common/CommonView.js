import Radio from 'backbone.radio';

import { View } from 'backbone.marionette'
import { isObject, isFunction, result, forEach, isString } from 'lodash'

import Ractive from './lib/ractive';
import { SetHash, SetProp } from './lib/decorators'

Radio.DEBUG = true

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
        $tmpl         = new Ractive(template)

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

  delegateRactiveObservers(observers) {
    const $tmpl = this.$tmpl
    if (!$tmpl) {
      return
    }

    observers || (observers = result(this, 'observers'))

    if (!observers) {
      return this
    }

    this.$observers = this.$observers || {}

    this.undelegateRactiveObservers()

    forEach(observers, (method, name) => {
      if (!isFunction(method)) {
        method = this[method]
      }
      return method && $tmpl.observe(name, method.bind(this))
    })
  }

  undelegateRactiveObservers(observers) {

    let $observers = observers

    if (observers) {
      if (isString(observers)) {
        $observers            = {}
        $observers[observers] = (this.$observers || {})[observers]
      }
    } else {
      $observers = this.$observers
    }

    if (!$observers) {
      return
    }

    return forEach($observers, ob => ob.cancel())
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

    forEach(events, (method, key) => {
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
    return forEach(events, selector => $tmpl.off(selector))
  }
}

export default CommonView

export function On(eventName) {
  return SetHash('ractiveEvents', eventName)
}

export function Observe(_path) {
  return SetHash('observe', _path)
}

export function Events(eventName) {
  return SetHash('events', eventName)
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
