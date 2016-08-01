import { default as CommonView, RactiveTemplate } from '../../../common/CommonView';
import authService from '../../../services/authService';
import AdminNavbarViewTmpl from './AdminNavbarView.html';

@RactiveTemplate({
  template:AdminNavbarViewTmpl,
  subscribeModel: true
  })
class AdminNavbarView extends CommonView {
    initialize() {
      this.model = authService
    }
  }

  export default AdminNavbarView
