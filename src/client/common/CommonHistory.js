// import { some } from 'lodash';
import { History } from 'backbone'

export class CommonHistory extends History {
  constructor() {
    super()

    this._goNextRoute = () => {
      this.loadUrl(this.fragment, this._nextRouteIndex)
    }
  }

  // Add a route to be tested when the fragment changes. Routes added later
  // may override previous routes.
  route(_route, _callback, _fragment) {
    this.handlers.push({
      route:    _route,
      callback: _callback,
      fragment: _fragment
    })
  }

  // Attempt to load the current URL fragment. If a route succeeds with a
  // match, returns `true`. If no defined routes matches the fragment,
  // returns `false`.
  loadUrl(fragment, i) {
    // If the root doesn't match, no routes can match either.
    if (!this.matchRoot()) {
      return false
    }
    fragment = this.fragment = this.getFragment(fragment)
    const length = this.handlers.length

    for (i = i || 0; i < length; i++) {
      const handler = this.handlers[i]
      if (handler.route.test(fragment)) {
        this._nextRouteIndex = i
        return handler.callback(fragment, this._goNextRoute)
      }
    }
  }

  _goNextRoute() {}
}

export default new CommonHistory();
