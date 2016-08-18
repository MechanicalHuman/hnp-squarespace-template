'use strict'

const debug = require('debug')('hnp:controllers:nav:global')
const lodash = require('lodash')
const tinycolor = require('tinycolor2')

const events = require('../../events')
const config = require('../../config')

module.exports = navigationController

function navigationController () {
  debug('Initializing Controller')
  const element = this

  events.on('color:main', colorCalculations)
  // events.on('color:restore', _setColors) // migth be redundant
  events.on('ajax:start', _setColors)

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy () {
    debug('Removing color Listeners')
    events.removeListener('color:main', colorCalculations)
    // events.removeListener('color:restore', _setColors)
    events.removeListener('ajax:start', _setColors)
  }

  /**
   * Calculates the apropiate bar color.
   *
   * @method    colorCalculations
   * @param     {Object}             color    SquareSpace Color Object
   */

  function colorCalculations (color) {
    /**
     * Color Object Example
     * color = {
     *   "topLeftAverage":      "2d1447",
     *   "topRightAverage":     "2c144f",
     *   "bottomLeftAverage":   "15003b",
     *   "bottomRightAverage":  "15003b",
     *   "centerAverage":       "3d0b69",
     *   "suggestedBgColor":    "2a1443"
     * }
     */

    if (!color) return
    const background = tinycolor.mix(
      tinycolor(color.topLeftAverage),
      tinycolor(color.topRightAverage)
    )
    const candidates = [
      tinycolor(config.nav.foreground),
      tinycolor(config.nav.background),
      tinycolor(color.suggestedBgColor)
    ]
    const options = {
      level: 'AA',
      size: 'small',
      includeFallbackColors: false
    }

    _setColors(
      background.setAlpha(config.nav.alpha).toString(),
      tinycolor.mostReadable(background, candidates, options).toString()
    )
  }

  /**
    * Sets the colors of the navigation bar
    *
    * @method     _setColors
    * @param      {String}        background   Css color for the brackground
    * @param      {String}        color        CSS color for the elements
    * @private
    */

  function _setColors (background, foreground) {
    if (!foreground) foreground = config.nav.foreground

    if (!background) {
      background = config.nav.background
      element.style.backgroundColor = 'transparent'
    } else {
      element.style.backgroundColor = background
    }

    element.style.color = foreground
    element.querySelector('.brand').style.fill = foreground
    const underlines = element.querySelectorAll('.nav-under')
    lodash.each(underlines, elem => {
      elem.style.backgroundColor = foreground
    })
  }
}
