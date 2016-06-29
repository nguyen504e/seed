import AppPageTemplate from './AppPage.html'
import { default as CommonView, Template, Regions } from '../../common/CommonView'

@Template(AppPageTemplate)
@Regions({content: '#content', header: '#header', footer: '#footer'})
class AppPage extends CommonView {

  initialize() {}

  onShow() {}
}

export default AppPage
