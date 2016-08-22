'use strict'

const debug = require('debug')('hnp:controllers:collection:archive')
const lodash = require('lodash')

const config = require('../../config')
const utils = require('../../utils')
const events = require('../../events')

module.exports = archiveController

function archiveController () {
  debug('Initializing Controller')

  const element = this
  const wrappers = element.querySelectorAll(config.thumbs.class)

  events.on('resize', setThumbSize)

  // Fire thumb calculations on load.
  setThumbSize()

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy () {
    debug('Removing "resize" listener')
    events.removeListener('resize', setThumbSize)
  }

  function setThumbSize (target) {
    if (!target) target = config.thumbs.default

    const viewport = utils.getViewport()

    let size = computeSize()

    /* Apply the new sizes */

    // element.style.paddingTop = `${size.margin * 2}px`
    element.style.paddingRight = `${size.margin}px`
    element.style.paddingLeft = `${size.margin}px`

    lodash.each(wrappers, elem => {
      elem.style.width = `${size.width}px`
      elem.style.paddingRight = `${size.margin}px`
      elem.style.paddingLeft = `${size.margin}px`
      elem.style.marginBottom = `${size.margin * 2}px`

      const thumbnail = elem.querySelector(config.thumbs.image)
      thumbnail.style.width = `${size.width}px`
      thumbnail.style.height = `${size.height}px`
      thumbnail.style.borderRadius = `${size.radius}px`
      thumbnail.style.marginBottom = `${Math.max(size.margin / 2, 10)}px`
    })

    utils.loadImages(element)

    function computeSize () {
      const minThumbs = Math.min(config.thumbs.max, wrappers.length)
      const maxThumbs = viewport.width <= 320 ? 1 : config.thumbs.min

      const currentMargin = Math.round(config.thumbs.margin * target * 2)
      const currentRow = Math.floor(viewport.width / (target + currentMargin))

      let rows = 0
      rows = currentRow
      rows = Math.max(rows, maxThumbs)
      rows = Math.min(rows, minThumbs)

      const size = {}

      size.width = getWidth(viewport.width, rows)
      size.height = config.thumbs.ratio * size.width
      size.margin = config.thumbs.margin * size.width
      size.radius = config.thumbs.border * size.width

      size.width = Math.floor(size.width)
      size.height = Math.floor(size.height)
      size.margin = Math.floor(size.margin)
      size.radius = Math.floor(size.radius)

      // debug(`Thumb Width = ${size.width}px`)
      // debug(`Thumb Margin = ${size.margin}px`)
      debug(size, 'thumbSize')
      return size
    }

    function getWidth (space, number) {
      const margins = ((number * 2) + 2) * config.thumbs.margin
      // debug(`Margins = ${margins} Thumb`)
      let width = space / (number + margins)
      return width
    }
  }
}

/*
- mashimachine
- dogparker
- dj51
- tire gauge
- city corruption
- glossy
- Amalgam
- well known extrangers
- CCTV glasses
- yasuni
- alzheimer
- Jail
- Twettron
- Parent Detector
- Moment of silence
 */
