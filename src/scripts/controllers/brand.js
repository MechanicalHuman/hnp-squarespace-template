'use strict'

const debug = require('debug')('hnp:controllers:brand')
const lodash = require('lodash')

const events = require('../events')
const utils = require('../utils')
const config = require('../config')

module.exports = brandController

function brandController () {
  debug('Initializing Controller')
  const element = this

  if (config.ajax.use) {
    events.on('ajax:start', startAnimation)
    events.on('ajax:end', completeAnimation)
  }

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy () {
    if (config.ajax.use) {
      debug('Removing all Listeners')
      events.removeListener('ajax:start', startAnimation)
      events.removeListener('ajax:end', completeAnimation)
    }
  }

  function completeAnimation () {
    utils.onAnimationIteration(element, function () {
      debug('Animation complete')
      utils.removeClass(element, 'spin')
    })
  }
  function startAnimation () {
    debug('Starting animation')
    utils.addClass(element, 'spin')
  }
}
