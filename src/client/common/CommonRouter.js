import { isFunction, isRegExp, result, keys } from 'lodash';
import { SetHash } from './lib/decorators'
import { Router } from 'backbone'
import history from './CommonHistory'

// Cached regular expressions for matching named param parts and splatted
// parts of route strings.
const optionalParam = /\((.*?)\)/g
const namedParam    = /(\(\?)?:\w+/g
const splatParam    = /\*\w+/g
const includeRegExp = /\S(\/\*\B)/
const escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g

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

  _routeToRegExp(route) {
    route = route.replace(escapeRegExp, '\\$&')
      .replace(optionalParam, '(?:$1)?')
      .replace(namedParam, function(match, optional) {
        return optional ? match : '([^/?]+)'
      })
      .replace(splatParam, '([^?]*?)')
      .replace(includeRegExp, (match, optional) => {
        return match.replace(optional, '\\/((?:.*))')
      })

    return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$')
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
      args.unshift(next)
      if (this.execute(callback, args, name) !== false) {
        this.trigger(['route:' + name].concat(args))
        this.trigger('route', name, args)
        history.trigger('route', this, name, args)
      }
    }, route)
    return this
  }
}

export default CommonRouter;

export function Route(route) {
  return SetHash('routes', route)
}
