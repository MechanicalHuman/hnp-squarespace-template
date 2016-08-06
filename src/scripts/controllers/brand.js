'use strict'

const debug = require('debug')('hnp:controllers:brand')
const events = require('../events')
const utils = require('../utils')
const lodash = require('lodash')

module.exports = brandController

function brandController () {
  debug('mounted')
  const element = this

  events.on('ajax:start', startAnimation)
  events.on('ajax:end', completeAnimation)

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy () {
    debug('destroy')
    events.removeListener('ajax:start', startAnimation)
    events.removeListener('ajax:end', completeAnimation)
  }

  function completeAnimation () {
    utils.onAnimationIteration(element, function () {
      debug('complete animation')
      utils.removeClass(element, 'spin')
    })
  }
  function startAnimation () {
    debug('start animation')
    utils.addClass(element, 'spin')
  }
}
