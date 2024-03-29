'use strict'

const debug = require('debug')('hnp:controllers:default')

module.exports = defaultController

function defaultController () {
  debug('Initializing Controller')
  const element = this

  const tweaks = []

  SQS.Tweak.watch(tweaks, onTweakChange)

  return {
    sync: sync,
    destroy: destroy
  }
}

function sync () {
  debug('sync')
}

function destroy () {
  debug('destroy')
}

function onTweakChange (tweak) {
  debug(arguments, 'tweak change')
}
