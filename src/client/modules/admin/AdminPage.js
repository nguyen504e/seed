import { default as CommonView, Regions, RactiveTemplate } from '../../common/CommonView';
import AdminNavbarView from './navbar/AdminNavbarView';
import AdminSidebarView from './sidebar/AdminSidebarView';
import AdminPageTmpl from './AdminPage.html'

@RactiveTemplate(AdminPageTmpl)
@Regions({
  content: '#content',
  header:  '#header',
  footer:  '#footer',
  sidebar: '#sidebar'
})
class AdminPage extends CommonView {
  onAttach() {
    this.showChildView('sidebar', new AdminSidebarView())
    this.showChildView('header', new AdminNavbarView())
  }
}

export default AdminPage;
