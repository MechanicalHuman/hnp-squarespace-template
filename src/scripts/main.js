'use strict'

const DEBUG = require('debug')

const config = require('./config')
const utils = require('./utils')
const events = require('./events')
const capabilities = require('./capabilities')
const AjaxLoader = require('./ajaxLoader')

const debug = require('debug')('hnp:main')

/**
 * Squarespace's Controllers
 *
 * @type    {Object}
 */

window.Controllers = {
  navigation: {
    global: require('./controllers/navigation/global'),
    archive: require('./controllers/navigation/archive')
  },
  collection: {
    archive: require('./controllers/collections/archive')
  },
  heroImage: require('./controllers/hero-image'),
  brand: require('./controllers/brand'),
  main: require('./controllers/main-content'),
  footer: require('./controllers/footer'),
  default: require('./controllers/default')
}

// ///////////////////////////////
// Initialize the application. //
// ///////////////////////////////

// Enable or disable the debug functionality.
if (config.debug) DEBUG.enable('hnp:*')
if (!config.debug) DEBUG.disable()

// If we are using the AJAX loader
if (config.ajax.use) {
  // Set the mainContainer state as faded
  utils.addClass(document.querySelector(config.mainContainer), 'loading')
  // Set the Brand state as Spining
  utils.addClass(document.querySelector(config.brandElement), 'spin')
}

// Subscribe @run to the window's 'DOMContentLoaded' event. (page is ready)
window.addEventListener('DOMContentLoaded', run)

/**
 * Starts the application.
 *
 * @method    run
 */

function run () {
  // Initialize the Ajax Loader.
  if (config.ajax.use) {
    debug('Using AJAX')
    let t = new AjaxLoader() // eslint-disable-line
    events.emit('ajax:end')
  } else {
    debug('No AJAX')
  }
  // Load all images via Squarespace's Responsive ImageLoader.
  utils.loadImages(document)

  // Set the screen orientation.
  utils.setOrientation()

  // Subscribe @emitResize to the window's 'resize' event.
  window.addEventListener('resize', utils.onResize)

  // Subscribe @setOrientation to the window's 'resize' event.
  window.addEventListener('resize', utils.setOrientation)

  // Subscribe @emitResize to the window's 'orientationchange' event.
  window.addEventListener('orientationchange', utils.onResize)

  // Subscribe @setOrientation to the window's 'orientationchange' event.
  window.addEventListener('orientationchange', utils.setOrientation)

  // Subscribe @loadImages to the window's 'orientationchange' event.
  window.addEventListener('orientationchange', () => utils.loadImages(document))
}
