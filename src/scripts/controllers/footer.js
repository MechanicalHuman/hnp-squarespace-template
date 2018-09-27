'use strict'

const debug = require('debug')('hnp:controllers:footer')
const lodash = require('lodash')
module.exports = defaultController

function defaultController() {
  debug('Initializing Controller')
  const element = this
  const anchors = element.querySelectorAll('a')
  lodash(anchors)
    .filter(_isFile)
    .each(_setAsDownlod)

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy() {
    debug('destroy')
  }
}

/**
 * Returns true is the link ends with an extension and is usting the http protocol
 *
 * @method     _isFile
 * @param      {HTMLAnchorElement}     anchor
 * @return     {Boolean}
 * @private
 */

function _isFile(anchor) {
  if (!anchor.href.match(/\.\S{2,3}$/)) return false
  if (!anchor.href.match(/^(http|https):/)) return false
  return true
}

/**
 * Sets the anchor as a download
 *
 * @method     _setAsDownlod
 * @param      {HTMLAnchorElement}         anchor
 * @private
 */

function _setAsDownlod(anchor) {
  anchor.setAttribute('download', anchor.href)
  // anchor.removeAttribute('target')
}
