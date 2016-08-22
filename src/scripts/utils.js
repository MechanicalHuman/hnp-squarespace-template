'use strict'

const debug = require('debug')('hnp:utils')
const lodash = require('lodash')

const config = require('./config')
const events = require('./events')

module.exports = {
  loadImages: loadImages,
  removeClass: removeClass,
  addClass: addClass,
  getViewport: getViewport,
  setOrientation: setOrientation,
  onAnimationEnd: onAnimationEnd,
  onAnimationIteration: onAnimationIteration,
  onResize: _throttledResize(),
  makeCSSGradient: makeCSSGradient,
  setActive: setActive,
  setExternalLinks: setExternalLinks
}

/**
 * Load images using the Squarespace Image Loader
 *
 * @method    loadImages
 * @param     {HTMLElement}    container
 * @param     {Object}        options
 */

function loadImages (container, options) {
  if (!container) container = document
  if (!options) options = {load: true}
  let images = container.querySelectorAll('img[data-src]')
  if (!images.length) return
  lodash.each(images, image => {
    SQS.ImageLoader.load(image, options)
  })
}

/**
 * Removes a class from the given HTMLElement
 *
 * @method    removeClass
 * @param     {HTMLElement}       elem
 * @param     {String}       className
 */

function removeClass (elem, className) {
  if (!elem) return
  if (!className) return
  elem.className = elem.className.replace(new RegExp(className, 'g'), '')
}

/**
 * Appends a class to the given HTMLElement
 *
 * @method    addClass
 * @param     {HTMLElement}       elem
 * @param     {String}       className
 */

function addClass (elem, className) {
  if (!elem) return
  if (!className) return
  removeClass(elem, className)
  elem.className = elem.className + ` ${className}`
}

/**
 * Returns the current Viewport Size in pixels
 *
 * @method    getViewport
 * @return    {Object}
 */

function getViewport () {
  const width = window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

  const height = window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight

  return {width: width, height: height}
}

/**
 * Appends 'landscape or 'portrait' to the document classes based on the
 *  current device orientation
 *
 * @method    setOrientation
 */

function setOrientation () {
  let orientation
  if (!window.orientation) {
    const viewport = getViewport()
    orientation = viewport.width < viewport.height ? 'portrait' : 'landscape'
  } else {
    if (window.orientation !== 90 && window.orientation !== -90) {
      orientation = 'portrait'
    } else {
      orientation = 'landscape'
    }
  }

  removeClass(document.documentElement, 'landscape')
  removeClass(document.documentElement, 'portrait')
  addClass(document.documentElement, orientation)
}

/**
 * Executes the callback function when the animation has completed.
 *
 * Based on
 *  http://osvaldas.info/examples/detecting-css-animation-transition-end-with-javascript/oncssanimationend.js
 *  By Osvaldas Valutis, www.osvaldas.info
 *
 * @method    onAnimationEnd
 * @param     {HTMLElement}  element
 * @param     {Function}  callback
 */

function onAnimationEnd (element, callback) {
  if (!element) return

  const body = document.documentElement || document.body
  const style = body.style

  let prefix = ''

  if (style.WebkitAnimation === '') prefix = '-webkit-'
  if (style.MozAnimation === '') prefix = '-moz-'
  if (style.OAnimation === '') prefix = '-o-'

  debug(prefix, 'onAnimationEnd')

  function runOnce () {
    callback()
    debug('remove', 'onAnimationEnd')
    element.removeEventListener('webkitAnimationEnd', runOnce)
    element.removeEventListener('mozAnimationEnd', runOnce)
    element.removeEventListener('oAnimationEnd', runOnce)
    element.removeEventListener('oanimationend', runOnce)
    element.removeEventListener('animationend', runOnce)
  }

  if (window.getComputedStyle(element)[ prefix + 'animation-duration' ] === '0s') {
    callback()
  } else {
    debug('addEventListener', 'onAnimationEnd')
    element.addEventListener('webkitAnimationEnd', runOnce)
    element.addEventListener('mozAnimationEnd', runOnce)
    element.addEventListener('oAnimationEnd', runOnce)
    element.addEventListener('oanimationend', runOnce)
    element.addEventListener('animationend', runOnce)
  }
}

/**
 * Executes the callback function when the animation has completed one loop.
 *
 * Based on
 *  http://osvaldas.info/examples/detecting-css-animation-transition-end-with-javascript/oncssanimationend.js
 *  By Osvaldas Valutis, www.osvaldas.info
 *
 * @method    onAnimationEnd
 * @param     {HTMLElement}  element
 * @param     {Function}  callback
 */

function onAnimationIteration (element, callback) {
  if (!element) return

  const body = document.documentElement || document.body
  const style = body.style
  const elemStyle = window.getComputedStyle(element)

  let prefix = ''

  if (style.WebkitAnimation === '') prefix = '-webkit-'
  if (style.MozAnimation === '') prefix = '-moz-'
  if (style.OAnimation === '') prefix = '-o-'

  function runOnce () {
    callback()
    element.removeEventListener('webkitAnimationIteration', runOnce)
    element.removeEventListener('animationiteration', runOnce)
  }

  if (elemStyle[ 'animation-duration' ] === '0s' || elemStyle[ prefix + 'animation-duration' ] === '0s') {
    callback()
  } else {
    element.addEventListener('webkitAnimationIteration', runOnce)
    element.addEventListener('animationiteration', runOnce)
  }
}

/**
 * Returns a broser aware CSS gradient String
 *
 * @method    makeCSSGradient
 * @param     {String}           start
 * @param     {String}           end
 * @param     {String}           direction
 * @return    {String}
 */

function makeCSSGradient (start, end, direction) {
  /* First detect the prefix */
  let prefix = ''
  let test = document.createElement('div')
  const prefixes = ['-o-', '-ms-', '-moz-', '-webkit-']

  prefixes.forEach(function (p) {
    test.style.background = `${p}linear-gradient(#000000, #ffffff)`
    if (test.style.background) prefix = p
  })
  test = null // Clean up after itself.

  /* apply defaults*/
  if (!start) start = '#000000'
  if (!end) end = start
  if (!direction) direction = 'left'

  return `${prefix}linear-gradient(${direction},${start},${end})`
}

function setActive () {
  const url = window.location.pathname
  const activeClass = config.ajax.activeNavClass
  Array.prototype.forEach.call(document.querySelectorAll('.' + activeClass), function (el) {
    el.classList.remove(activeClass)
  })

  Array.prototype.forEach.call(document.querySelectorAll('[href="' + url + '"]'), function (el) {
    el.parentNode.classList.add(activeClass)
  })
}

function setExternalLinks () {
  const links = document.querySelectorAll('a[href]')
  lodash.each(links, el => {
    const url = el.getAttribute('href')
    const isExternal = /(^http|^https)/
    if (isExternal.test(url)) el.setAttribute('target', '_blank')
  })
}

/**
 * Returns a throttled function which emits the resize Event and triggers the
 *  Squarespace Image Loader on the whole document.
 *
 * @method     _throttledResize
 * @return     {Function}
 * @private
 */
function _throttledResize () {
  return lodash.throttle(emitResize, config.debounceTick)

  function emitResize () {
    events.emit('resize')
    loadImages(document)
  }
}
