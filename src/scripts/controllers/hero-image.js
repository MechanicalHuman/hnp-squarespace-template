'use strict'

const debug = require('debug')('hnp:controllers:heroImage')
const lodash = require('lodash')

const events = require('../events')
const utils = require('../utils')
const config = require('../config')

module.exports = heroImageController

function heroImageController () {
  debug('Initializing Controller')
  const element = this
  const color = JSON.parse(element.getAttribute('data-color'))
  const update = lodash.throttle(updateImage, config.debounceTick)

  debug('Emitting image color values')
  events.emit('color:main', color)
  if (config.ajax.use) events.on('ajax:end', update)
  window.addEventListener('DOMContentLoaded', update)
  events.on('resize', update)

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy () {
    debug('Restoring color values')
    events.emit('color:restore')
    if (config.ajax.use) events.removeListener('ajax:end', update)
    window.removeEventListener('DOMContentLoaded', update)
    events.removeListener('resize', update)
  }

  function updateImage () {
    debug('Resizing heroImage')
    utils.loadImages(element)
  }
}
