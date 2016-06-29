import path from 'path';

// Test specific configuration
// ===========================
export default {
  // Logger config
  log: {
    level:     'INFO',
    appenders: {
      test: {
        type:       'file',
        filename:   path.resolve(__dirname, '../../../log/test.log'),
        maxLogSize: 20480,
        backups:    3
      }
    }
  },

  // MongoDB connection options
  mongo: {
    uri:      'mongodb://localhost/seed-test',
    logLevel: 'error'
  }
}
