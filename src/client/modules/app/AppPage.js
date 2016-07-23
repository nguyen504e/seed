import NavbarView from './navbar/NavbarView';
import SidebarView from './sidebar/SidebarView';

import AppPageTemplate from './AppPage.html'
import { default as CommonView, RactiveTemplate, Regions } from '../../common/CommonView'

@RactiveTemplate(AppPageTemplate)
@Regions({
  content: '#content',
  header:  '#header',
  footer:  '#footer',
  sidebar: '#sidebar'
})
class AppPage extends CommonView {

  initialize() {}

  onAttach() {
    this.showChildView('header', new NavbarView())
    this.showChildView('sidebar', new SidebarView())
  }
}

export default AppPage
