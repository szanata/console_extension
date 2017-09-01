require('console_extension');

module.exports = {
  runConsoleError() {
    console.error('A simple error log');
  },

  runConsoleWarn() {
    console.warn('A simple warn log');
  },

  runConsoleDebug() {
    console.debug('A simple debug log');
  },

  runConsoleInfo() {
    console.info('A simple info log');
  },

  runConsoleTable() {
    console.table('A simple table log');
  },

  runScope(scope, ...args) {
    scope.call( this, ...args );
  }
}
