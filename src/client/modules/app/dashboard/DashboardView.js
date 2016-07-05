import { default as CommonView, RactiveTemplate } from '../../../common/CommonView'
import DashboardTemplate from './DashboardView.html'

@RactiveTemplate(DashboardTemplate)
class DashboardView extends CommonView {
  constructor() {
    super(arguments)
  }
}

export default DashboardView
