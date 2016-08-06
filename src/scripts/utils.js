'use strict'

const debug = require('debug')('hnp:utils')
const lodash = require('lodash')

const config = require('./config')
const events = require('./events')

module.exports = {
  loadImages: loadImages,
  removeClass: removeClass,
  addClass: addClass,
  emitResize: lodash.throttle(_emitResize, config.debounceTick),
  getViewport: getViewport,
  setOrientation: setOrientation,
  onAnimationEnd: onAnimationEnd,
  onAnimationIteration: onAnimationIteration,
  getClosest: getClosest

}

function loadImages (container = document , options = {load: true}) {
  let images = container.querySelectorAll('img[data-src]')
  lodash.each(images, image => {
    SQS.ImageLoader.load(image, options)
  })
}

function removeClass (elem, className) {
  if (!elem) return
  if (!className) return
  elem.className = elem.className.replace(new RegExp(className, 'g'), '')
}

function addClass (elem, className) {
  if (!elem) return
  if (!className) return
  removeClass(elem, className)
  elem.className = elem.className + ` ${className}`
}

function getViewport () {
  const width = window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

  const height = window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight

  return {width: width, height: height}
}

function setOrientation () {
  let orientation = 'landscape'
  if (window.orientation !== 90 && window.orientation !== -90) {
    orientation = 'portrait'
  }
  removeClass(document.documentElement, 'landscape')
  removeClass(document.documentElement, 'portrait')
  addClass(document.documentElement, orientation)
}

/* TODO: Discover the usecase of this */
function getClosest (elem, selector) {
  var firstChar = selector.charAt(0)

  // Get closest match
  for (; elem && elem !== document; elem = elem.parentNode) {
    // If selector is a class
    if (firstChar === '.') {
      if (elem.classList.contains(selector.substr(1))) {
        return elem
      }
    }

    // If selector is an ID
    if (firstChar === '#') {
      if (elem.id === selector.substr(1)) {
        return elem
      }
    }

    // If selector is a data attribute
    if (firstChar === '[') {
      if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
        return elem
      }
    }

    // If selector is a tag
    if (elem.tagName.toLowerCase() === selector) {
      return elem
    }
  }

  return false
}

/**
 * Executes the callback function when the animation has completed.
 *
 * Based on
 *  http://osvaldas.info/examples/detecting-css-animation-transition-end-with-javascript/oncssanimationend.js
 *  By Osvaldas Valutis, www.osvaldas.info
 *
 * @method    onAnimationEnd
 * @param     {DOMElement}  element
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
 * @param     {DOMElement}  element
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

/* Private Methods */

/**
 * Emits a resize event with the value of the viewport
 *
 * @method     _emitResize
 * @private
 */

function _emitResize () {
  events.emit('resize', getViewport())
}
