import { expect } from 'chai'

import agent from './lib/test.agent'
import Stt from '../config/status'

describe('server', function() {
  it('should work', function(done) {
    agent.get('/').end(function(err, res) {
      expect(res).have.status(Stt.OK)
      done()
    })
  })
})
