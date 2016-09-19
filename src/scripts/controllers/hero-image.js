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

  debug('Emitting image color values')
  events.emit('color:main', color)

  if (config.ajax.use) {
    events.on('ajax:end', setproportion)
  } else {
    window.addEventListener('DOMContentLoaded', setproportion)
  }

  events.on('resize', setproportion)

  return {
    sync: setproportion,
    destroy: destroy
  }

  function destroy () {
    debug('Restoring color values')
    events.emit('color:restore')
    if (config.ajax.use) {
      events.removeListener('ajax:end', setproportion)
    } else {
      window.removeEventListener('DOMContentLoaded', setproportion)
    }
    events.removeListener('resize', setproportion)
  }

  function setproportion () {
    element.style.removeProperty('height')
    const currentSize = element.getBoundingClientRect()
    const aspectRatio = currentSize.width / currentSize.height
    debug(aspectRatio, 'aspectRatio')
    if (aspectRatio > 2) {
      debug('Setting hard limit', 'aspectRatio')
      element.style.height = '56.25vw'
    } else if (aspectRatio < 0.5) {
      debug('Setting hard limit', 'aspectRatio')
      element.style.height = '177.77vw'
    }
    window.requestAnimationFrame(function () {
      utils.loadImages(element)
    })
  }
}
