import chai from 'chai'
import chaiHttp from 'chai-http'

import server from '../../index'

chai.use(chaiHttp)

export default chai.request(server)
