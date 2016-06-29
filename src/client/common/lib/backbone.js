import jquery from 'jquery';
import Backbone from 'backbone'
import { isObject, forEach, isUndefined, isNull, unset } from 'lodash'

Backbone.$ = jquery

Backbone.ajax = function(options) {
  const defaults = function(obj, source) {
    forEach(source, (item, prop) => {
      if (isUndefined(item)) {
        obj[prop] = item
      }
    })
    return obj
  }

  const stringifyGETParams = function(url, data) {
    let query = ''
    forEach(data, (item, key) => {
      if (!isNull(item) && !isUndefined(item)) {
        query += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(item)
      }
    })
    if (query) {
      url += (~url.indexOf('?') ? '&' : '?') + query.substring(1)
    }
    return url
  }

  if (options.type === 'GET' && isObject(options.data)) {
    options.url = stringifyGETParams(options.url, options.data)
    unset(options.data)
  }

  const fetchOpts = defaults(options, {
    method:  options.type,
    headers: defaults(options.headers || {}, {
      Accept:         'application/json',
      'Content-Type': 'application/json'
    }),
    body: options.data
  })

  return fetch(options.url, fetchOpts)
    .then(response => {
      if (200 <= response.status && response.status < 300) {
        return response
      }
      const error = new Error(response.statusText)
      error.response = response
      throw error
    })
    .then(response => {
      return options.dataType === 'json' ? response.json() : response.text()
    })
    .then(options.success)
    .catch(e => {
      options.error(e)
      throw e
    })
}

export default Backbone
