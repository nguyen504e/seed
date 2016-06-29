/*eslint no-process-env:0*/

// All configurations will extend these options
// ============================================
//

import { merge } from 'lodash'

import dev from './development'
import pro from './production'
import tes from './test';

const def = {
  domain: 'http://localhost:3000',

  expiresInMinutes: 300,

  // Logger config
  log: {
    level:  'ALL',
    layout: {
      type:    'pattern',
      pattern: '%[%d{yyMMdd:hhmmss.SSS}:%-5p%][%-7c] %m'
    },
    appenders: {
      'default': {
        type:       'file',
        filename:   'server',
        maxLogSize: 20480,
        backups:    10,
        layout:     {
          type:    'pattern',
          pattern: '%d{yyMMdd:hhmmss.SSS}:%-5p% %-7c% - %m'
        }
      },
      db: {
        type:       'file',
        filename:   'db',
        maxLogSize: 20480,
        backups:    10,
        layout:     {
          type:    'pattern',
          pattern: '%d{yyMMdd:hhmmss.SSS}:%-5p% %-7c% - %m'
        }
      },
      dbSeed: {
        type:       'file',
        filename:   'dbSeed',
        maxLogSize: 10240,
        backups:    10,
        layout:     {
          type:    'pattern',
          pattern: '%d{yyMMdd:hhmmss.SSS}:%-5p% %-7c% - %m'
        }
      }
    }
  },

  // Static directory path
  staticPath: 'client/',

  // Server port
  port: 3000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'seed-secret'
  },

  // List of user roles
  userRoles: [
    'guest',
    'user',
    'admin'
  ],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  authTypes: [
    'github',
    'twitter',
    'facebook',
    'google'
  ],

  facebook: {
    clientID:     'id',
    clientSecret: 'secret',
    callbackURL:  '/auth/facebook/callback'
  },

  twitter: {
    clientID:     'id',
    clientSecret: 'secret',
    callbackURL:  '/auth/twitter/callback'
  },

  google: {
    clientID:     'id',
    clientSecret: 'secret',
    callbackURL:  '/auth/google/callback'
  }
}

let config

/*eslint no-process-env: 0*/
switch (process.env.NODE_ENV) {
  case 'development':
    config = dev
    break
  case 'test':
    config = tes
    break
  default:
    config = pro
    break
}

// Export the config object based on the NODE_ENV
// ==============================================
export default merge(def, config)
