'use strict'

module.exports = {
  files: ['template/**/*', '!template/.git/**/*'],
  logLevel: 'info',
  logPrefix: 'HNP',
  logConnections: true,
  logFileChanges: true,
  open: false,
  browser: 'default',
  reloadOnRestart: true,
  notify: false,
  reloadDebounce: 200,
  plugins: ['browser-sync-logger'],
  injectChanges: false,
  codeSync: false,
  timestamps: true
}
