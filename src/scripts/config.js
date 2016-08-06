'use strict'

const debug = require('debug')('hnp:ajax:config')

const AJAX = true
const DEBUG = true

const config = { }

config.debug = DEBUG
config.authenticated = document.documentElement.classList.contains('authenticated-account')
config.mainContainer = '.main-content'
config.useAjax = useAjax()
config.debounceTick = 100
config.thumbRatio = 0.77391304

module.exports = config

function useAjax () {
  let use = true
  if (AJAX === false) use = false
  if (config.authenticated === true) use = false
  if ('history' in window === false) use = false
  if ('querySelector' in document === false) use = false
  debug(`AjaxLoader: ${use}`)
  return use
}
