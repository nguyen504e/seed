import { Application } from 'backbone.marionette'

import { SetHash } from './lib/decorators'

class CommonApplication extends Application {

}

export default CommonApplication

function _setRadio(type, propertiesName) {
  return SetHash(type, propertiesName, target => {
    if (!target.channelName) {
      target.channelName = 'global'
    }
  })
}

export function RadioEvents(eventName) {
  return _setRadio('radioEvents', eventName)
}

export function RadioRequests(eventName) {
  return _setRadio('radioRequests', eventName)
}
