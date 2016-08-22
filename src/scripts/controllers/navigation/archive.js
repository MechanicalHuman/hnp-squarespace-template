'use strict'

const debug = require('debug')('hnp:controllers:nav:archive')
const lodash = require('lodash')

const utils = require('../../utils')
const config = require('../../config')
const events = require('../../events')

module.exports = archiveNavController

function archiveNavController () {
  debug('Initializing Controller')
  const element = this
  const currentId = element.getAttribute('data-current-id')

  let items = element.querySelectorAll(config.thumbs.class)
  items = lodash.filter(items, item => {
    const itemId = item.getAttribute('data-item-id')
    if (currentId === itemId) {
      utils.addClass(item, 'hidden')
      return false
    }
    return true
  })

  events.on('resize', setThumbSize)

  setThumbSize()

  function setThumbSize () {
    const size = computeSize()

    lodash.each(items, item => {
      item.style.width = `${size.width}px`
      item.style.paddingRight = `${size.margin}px`
      item.style.paddingLeft = `${size.margin}px`
      item.style.marginBottom = `${size.margin * 2}px`

      const thumbnail = item.querySelector(config.thumbs.image)
      thumbnail.style.width = `${size.width}px`
      thumbnail.style.height = `${size.height}px`
      thumbnail.style.borderRadius = `${size.radius}px`
      thumbnail.style.marginBottom = `${Math.max(size.margin / 2, 10)}px`
    })

    if (size.useMargins) {
      element.style.paddingRight = `${size.margin}px`
      element.style.paddingLeft = `${size.margin}px`
    } else {
      element.style.paddingRight = 'unset'
      element.style.paddingLeft = 'unset'
    }

    utils.loadImages(element)
  }

  return {
    sync: lodash.noop,
    destroy: destroy
  }

  function destroy () {
    debug('Removing "resize" listener')
    events.removeListener('resize', setThumbSize)
  }

  function computeSize () {
    const viewport = utils.getViewport()
    const currentMargin = Math.round(config.thumbs.margin * config.thumbs.default * 2)
    const currentRow = Math.floor(viewport.width / (config.thumbs.default + currentMargin))
    const maxItems = Math.min(items.length, currentRow)

    // debug(`MAXITEMS: ${maxItems} -> ${currentRow}`)

    let columns = 1 // So it gets at least 2
    let width = 0 // do statements evaluate after the block
    let isMax = false

    do {
      // debug(`${columns} -> ${width}`)
      columns = columns + 1
      width = getWidth(viewport.width, columns)
      // debug(`${columns} -> ${width}`)
      if (columns >= items.length) {
        isMax = true
        debug('Max Column reached')
      }
    } while (width > config.thumbs.minWidth && maxItems > columns)

    const size = {}

    size.width = getWidth(viewport.width, columns)
    size.height = config.thumbs.ratio * size.width
    size.margin = config.thumbs.margin * size.width
    size.radius = config.thumbs.border * size.width

    size.width = Math.floor(size.width)
    size.height = Math.floor(size.height)
    size.margin = Math.floor(size.margin)
    size.radius = Math.floor(size.radius)
    size.useMargins = isMax

    debug(size, 'thumbSize')

    return size
  }

  function getWidth (space, number) {
    const margins = ((number * 2) + 2) * config.thumbs.margin
    let width = space / (number + margins)
    return width
  }
}
