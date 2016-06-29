import HeaderTemplate from './header.ractive.html'
import { default as CommonView, On } from '../../common/CommonView'

class HeaderView extends CommonView {
  get template() {
    return HeaderTemplate
  }

  @On('onclickbtn')
  onClick() {}
}

export default HeaderView
