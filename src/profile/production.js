/*eslint no-process-env:0*/

// Production specific configuration
// =================================

export default {
  profileName: 'production',

  // Logger config
  log: {
    level: 'ERROR'
  },

  // Server IP
  ip: '',

  // Server port
  port: 8080,

  // MongoDB connection options
  mongo: {
    uri:      'mongodb://localhost/seed',
    logLevel: 'error'
  }
}
