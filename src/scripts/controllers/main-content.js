'use strict'

const debug = require('debug')('hnp:controllers:mainContent')
const events = require('../events')
const utils = require('../utils')
const lodash = require('lodash')

module.exports = mainContentController

function mainContentController () {
  debug('mounted')
  const element = this

  events.on('ajax:start', fadeOut)
  events.on('ajax:end', fadeIn)

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy () {
    debug('destroy')
    events.removeListener('ajax:start', fadeOut)
    events.removeListener('ajax:end', fadeIn)
  }

  function fadeIn () {
    debug('fadeIn')
    utils.removeClass(element, 'loading')
  // setTimeout(function () {
  //   element.style['max-height'] = 'unset'
  //   utils.removeClass(element, 'loading')
  // }, 0)
  }
  function fadeOut () {
    debug('fadeOut')
    // element.style['max-height'] = '100px'
    utils.addClass(element, 'loading')
  }
}
