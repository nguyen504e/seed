import NavbarView from './navbar/NavbarView';

import AppPageTemplate from './AppPage.html'
import { default as CommonView, RactiveTemplate, Regions } from '../../common/CommonView'

@RactiveTemplate(AppPageTemplate)
@Regions({content: '#content', header: '#header', footer: '#footer'})
class AppPage extends CommonView {

  initialize() {}

  onAttach() {
    this.showChildView('header', new NavbarView())
  }
}

export default AppPage
