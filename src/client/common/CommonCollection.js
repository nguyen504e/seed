import { Collection } from 'backbone'

import config from '../../config'

class CommonCollection extends Collection {
  url() {
    return config.baseURL + (this.restUrl || '')
  }
}

export default CommonCollection
