'use strict'

module.exports = {
  fadeIn: fadeIn,
  fadeOut: fadeOut,
  fade: fade,
  slideUp: slideUp,
  slideIntoView: slideIntoView
}

function fadeIn (el, duration, cb) {
  var container = document.querySelector('[data-ajax-loader="loaded"] ' + el)
  container.setAttribute('style', 'opacity: 1; -webkit-transition: opacity ' + duration + 's; transition: opacity ' + duration + 's;')
  if (cb) {
    window.setTimeout(cb, duration)
  }
}

function fadeOut (el, duration, cb) {
  var container = document.querySelector('[data-ajax-loader="loading"] ' + el)
  container.setAttribute('style', 'opacity: 0; -webkit-transition: opacity ' + duration + 's; transition: opacity ' + duration + 's;')
  if (cb) {
    window.setTimeout(cb, duration * 1000)
  }
}

function fade (type, el, duration) {
  var opacity
  var elementLoadState
  if (type === 'in') {
    opacity = 1
    elementLoadState = '[data-ajax-loader="loaded"]'
  } else {
    opacity = 0
    elementLoadState = '[data-ajax-loader="loading"]'
  }

  document.querySelector(elementLoadState + ' ' + el).setAttribute('style', 'opacity: ' + opacity + '; -webkit-transition: opacity ' + duration + 's; transition: opacity ' + duration + 's;')
}

function slideUp (el, duration, cb) {
  document.querySelector(el).classList.add('slide-up')
  if (cb) {
    window.setTimeout(cb, duration * 1000)
  }
}

function slideIntoView (el, duration, cb) {
  document.querySelector(el).classList.add('slide-into-view')
  if (cb) {
    cb()
  }
}
