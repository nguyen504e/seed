import { isFunction, each, isObject } from 'lodash'

export function SetHash(type, propertiesName, next) {
  return function(target, name) {
    if (!target[type]) {
      target[type] = {}
    }
    if (isFunction(target[type])) {
      throw new Error('The decorator is not compatible with an properties method')
      return
    }
    if (!propertiesName && propertiesName !== '') {
      throw new Error('The decorator requires an propertiesName argument')
    }
    target[type][propertiesName] = name

    if (next) {
      next(target, name)
    }
  }
}

export function SetProp(name, value, isReplace) {
  return function decorator(target) {
    const prototype = target.prototype
    if (isReplace || !prototype[name]) {
      prototype[name] = value
    } else if (isObject(prototype[name])) {
      each(value, (name, selector) => {
        return prototype[name] = selector
      })
    }
  }
}
