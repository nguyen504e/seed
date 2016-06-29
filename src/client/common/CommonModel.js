import { Model } from 'backbone'
import { result } from 'lodash'

import config from '../../config'

class CommonModel extends Model {
  urlRoot() {
    const url = result(this, 'restUrlRoot')
    if (url) {
      return config.baseURL + url
    }
  }
}

export default CommonModel
