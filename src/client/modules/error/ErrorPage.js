import notFoundTmpl from './404.html'
import CommonView from '../../common/CommonView';

class ErrorPage extends CommonView {
  constructor(errCode) {
    super()
    this.errCode = errCode
  }

  get template() {
    switch (this.errCode) {
      case 404:
        return notFoundTmpl
      default:
        return false
    }
  }
}

export default ErrorPage;
