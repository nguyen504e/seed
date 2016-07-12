import page from 'page';
import { isFunction, flatten, bind, uniqueId, compact } from 'lodash'
import { SetProp } from './lib/decorators'

const stylesIdx = []

class CommonLoader {
  constructor(root) {
    if (isFunction(this.initialize)) {
      this.initialize()
    }

    this.root = root
    this.id   = uniqueId()
    this._bind()
    this._processLoader()
    this._processChildren()
  }

  _processLoader() {
    if (!this.load) {
      return this
    }

    this._load = this.load
    this.load  = () => {
      if (!this.module) {
        this.module = new Promise((resolve, reject) => {
          this._load().then(mdl => {
            if (mdl && mdl.css) {
              this._loadStyle(mdl.css)
            }

            resolve(mdl)
          }, reject)
        })
      //
      //  this._load()
      // this.module.
      }
      return this.module
    }

  // this.load()
  }

  redirect(ctx) {
    return page.redirect(ctx)
  }

  navigate(_path) {
    return page.redirect((this.root || '') + _path)
  }

  stop() {
    return page.stop()
  }

  process(endpoint, callback) {
    if (endpoint && callback) {
      page(endpoint, callback)
    }

    return this
  }

  _bind() {
    const root        = this.root || ''
    const routes      = this.routes
    const afterRoutes = this.afterRoutes || {}

    if (!routes) {
      return
    }

    while (routes.length) {
      const route = routes.shift()
      const args  = compact(flatten([
        root + route.endpoint,
        route.before,
        bind(this[route.name], this),
        route.after,
        afterRoutes[route.endpoint]
      ]))

      page(...args)
    }
  }

  _processChildren() {
    const base     = this.base || ''
    const root     = this.root || ''
    const children = this.children
    if (!children) {
      return
    }

    while (children.length) {
      const Loader = children.shift()
      new Loader(root + base)
    }
  }

  _loadStyle(css) {
    const prefix = 'style-'
    stylesIdx.push(this.id)
    stylesIdx.sort()

    const head = document.head
    let style  = head.querySelector('#' + prefix + this.id)
    if (!style) {
      style      = document.createElement('style')
      style.type = 'text/css'
      style.id   = prefix + this.id
      console.log(style.id)

      const currentIdx = stylesIdx.indexOf(this.id)
      if (currentIdx === stylesIdx.length - 1) {
        head.appendChild(style)
      } else {
        const lastSib = head.querySelector('#' + prefix + stylesIdx[currentIdx + 1])
        head.insertBefore(style, lastSib)
      }
    }

    style.appendChild(document.createTextNode('\n' + css))
  }

}

export default CommonLoader

export function Base(base) {
  return SetProp('base', base, true)
}

export function Children(children) {
  children = Array.isArray(children) ? children : Array.from(arguments)
  return SetProp('children', children, true)
}

export function Route(endpoint, method, before, after) {
  return function(target, name) {
    if (target.base) {
      endpoint = target.base + endpoint
    }

    const routerDef = target.routes = target.routes || []
    routerDef.push({
      endpoint,
      method,
      before,
      after,
      name
    })
  }
}
