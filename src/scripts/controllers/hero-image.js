'use strict'

const debug = require('debug')('hnp:controllers:heroImage')
const lodash = require('lodash')

const events = require('../events')
const utils = require('../utils')

module.exports = heroImageController

function heroImageController () {
  debug('Initializing Controller')
  const element = this
  const color = JSON.parse(element.getAttribute('data-color'))
  utils.loadImages(element)
  debug('Emitting image color values')
  events.emit('color:main', color)
  return {
    sync: lodash.noop,
    destroy: destroy
  }
}

function destroy () {
  debug('Restoring color values')
  events.emit('color:restore')
}
