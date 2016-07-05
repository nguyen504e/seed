import AuthService from '../../../services/authService';
import CommonModel from '../../../common/CommonModel';

class LoginModel extends CommonModel {
  login() {
    return AuthService.login(this.toJSON())
  }
}

export default LoginModel
