import { isFunction, isRegExp, result, keys } from 'lodash';
import { SetHash } from './lib/decorators'
import { Router } from 'backbone'
import history from './CommonHistory'

class CommonRouter extends Router {
  _bindRoutes() {
    if (!this.routes) {
      return
    }
    this.routes = result(this, 'routes')
    let route
    const routes = keys(this.routes)
    while ((route = routes.shift())) {
      this.route(route, this.routes[route])
    }
  }

  // Manually bind a single named route to a callback. For example:
  //
  //     this.route('search/:query/p:num', 'search', function(query, num) {
  //       ...
  //     });
  //
  route(route, name, callback) {
    let routeParse = isRegExp(route) ? route : this._routeToRegExp(route)
    if (isFunction(name)) {
      callback = name
      name     = ''
    }
    if (!callback) {
      callback = this[name]
    }
    history.route(routeParse, (fragment, next) => {
      const args = this._extractParameters(routeParse, fragment)
      if (this.execute(callback, args, name, next) !== false) {
        this.trigger(['route:' + name].concat(args))
        this.trigger('route', name, args)
        history.trigger('route', this, name, args)
      }
    }, route)
    return this
  }

  // Execute a route handler with the provided parameters.  This is an
  // excellent place to do pre-route setup or post-route cleanup.
  execute(callback, args, name, ...next) {
    if (callback) {
      callback.apply(this, args, next)
    }
  }
}

export default CommonRouter;

export function Route(route) {
  return SetHash('routes', route)
}
