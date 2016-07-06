import CommonModel from './CommonModel';
import authService from '../services/authService';

class SecureModel extends CommonModel {
  sync(method, model, options) {
    const token = authService.get('token')
    if (token) {
      const headers = options.headers || (options.headers = {})
      headers.access_token = token
    }
    return super.sync.call(this, method, model, options)
  }
}

export default SecureModel
