'use strict'

const debug = require('debug')

const utils = require('./utils')
const config = require('./config')
const events = require('./events')
const ajaxLoader = require('./ajaxLoader')

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
    default: require('./controllers/collections/default'),
    archive: require('./controllers/collections/archive')
  },
  banner: require('./controllers/hero-image'),
  brand: require('./controllers/brand'),
  main: require('./controllers/main-content'),
  default: require('./controllers/default')
}

// ///////////////////////////////
// Initialize the application. //
// ///////////////////////////////

// Enable or disable the debug functionality.
if (config.debug) debug.enable('hnp:*')
if (!config.debug) debug.disable()

// Subscribe @run to the window's 'DOMContentLoaded' event. (page is ready)
window.addEventListener('DOMContentLoaded', run)

/**
 * Starts the application.
 *
 * @method    run
 */

function run () {
  // Initialize the Ajax Loader.
  ajaxLoader.init()

  // Emmit a false ajax:end event in order to trigger the page loaded state.
  events.emit('ajax:end')

  // Load all images via Squarespace's Responsive ImageLoader.
  utils.loadImages()

  // Set the screen orientation.
  utils.setOrientation()

  // Subscribe @emitResize to the window's 'resize' event.
  window.addEventListener('resize', utils.emitResize)

  // Subscribe @loadImages to the window's 'resize' event.
  window.addEventListener('resize', utils.loadImages)

  // Subscribe @setOrientation to the window's 'orientationchange' event.
  window.addEventListener('orientationchange', utils.setOrientation)

  // Subscribe @emitResize to the window's 'orientationchange' event.
  window.addEventListener('orientationchange', utils.emitResize)

  // Subscribe @loadImages to the window's 'orientationchange' event.
  window.addEventListener('orientationchange', utils.loadImages)
}
