
import express from 'express'

import facebook from './facebook'
import google from './google'
import local from './local'
import twitter from './twitter'

export default express.Router()
  .use('/local', local)
  .use('/facebook', facebook)
  .use('/twitter', google)
  .use('/google', twitter)
