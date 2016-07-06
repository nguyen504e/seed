import { default as CommonView, RactiveTemplate, Regions } from '../../common/CommonView';
import AuthPageTemplate from './AuthPage.html';

@RactiveTemplate(AuthPageTemplate)
@Regions({content: '#content', header: '#header', footer: '#footer'})
class AuthPage extends CommonView {
}

export default AuthPage
