// Development specific configuration
// ==================================
export default {
  // MongoDB connection options
  profileName: 'development',

  // Logger config
  log: {
    level: 'DEBUG'
  },

  mongo: {
    uri:      'mongodb://localhost:27017/seed-dev',
    logLevel: 'debug'
  },

  seedDB: true
}
