'use strict'

const debug = require('debug')('hnp:controllers:mainContent')
const events = require('../events')
const utils = require('../utils')
const lodash = require('lodash')
const config = require('../config')

module.exports = mainContentController

function mainContentController () {
  debug('Initializing Controller')
  const element = this

  if (config.ajax.use) {
    events.on('ajax:start', fadeOut)
    events.on('ajax:end', fadeIn)
  }

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy () {
    if (config.ajax.use) {
      debug('Removing all Listeners')
      events.removeListener('ajax:start', fadeOut)
      events.removeListener('ajax:end', fadeIn)
    }
  }

  function fadeIn () {
    debug('Revealing content')
    utils.removeClass(element, 'loading')
  }

  function fadeOut () {
    debug('Fading content')
    utils.addClass(element, 'loading')
  }
}
