'use strict'

const env = require('./env')

const anchors = [
  /* External Links */
  'not([href^="http"])',
  'not([href^="https"])',

  /* Bookmar Links */
  'not([href^="#"])',
  'not([href^="/#"])',

  /* Protocol specific */
  'not([href^="mailto"])',
  'not([href^="tel"])',
  'not([href^="javascript"])',

  /* Squarespace Specific */
  'not([href^="/commerce"])',
  'not(.nav-item-splash-page)',

  /* Common Extensions */
  'not([href$="vcf"])',
  'not([href$="pdf"])',
  'not([href$="txt"])',
  'not([href$="md"])',
  'not([href$="jpg"])',
  'not([href$="png"])',
  'not([href$="psd"])',
  'not([href$="mov"])',
  'not([href$="mp4"])',
  'not([href$="mp3"])'
]

const config = { }

config.debug = env !== 'production'
config.authenticated = document.documentElement.classList.contains('authenticated-account')
config.mainContainer = '.main-content'
config.brandElement = '#branding'
config.debounceTick = 100

config.ajax = {
  use: useAjax(),
  anchors: `a[href]:${anchors.join(':')}`,
  timeout: 6000,
  activeNavClass: 'active'
}

config.thumbs = {
  ratio: 1.29213483,
  default: 178,
  margin: 0.11235955,
  border: 0.03370787,
  max: 5,
  min: 2
}

module.exports = config

function useAjax () {
  let use = true
  if (config.authenticated === true) use = false
  if ('history' in window === false) use = false
  if ('querySelector' in document === false) use = false
  return use
}
