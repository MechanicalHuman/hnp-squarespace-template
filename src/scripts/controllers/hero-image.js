'use strict'

const debug = require('debug')('hnp:controllers:heroImage')

module.exports = defaultController

function defaultController (element) {
  debug(arguments, 'load')

  const tweaks = []

  SQS.Tweak.watch(tweaks, onTweakChange)
  sync()

  return {
    sync: sync,
    destroy: destroy
  }
}

function sync () {
  debug(arguments, 'sync')
}

function destroy () {
  debug(arguments, 'destroy')
}

function onTweakChange (tweak) {
  debug(arguments, 'tweak change')
}
