'use strict'

const debug = require('debug')('hnp:controllers:collection:archive')
const lodash = require('lodash')

const config = require('../../config')
const utils = require('../../utils')
const events = require('../../events')

const thumbClass = '.archive-item-image'
const wrapClass = '.archive-item'

module.exports = archiveController

function archiveController () {
  const element = this

  const tweaks = []
  const thumbnails = element.querySelectorAll(thumbClass) || []
  const wrappers = element.querySelectorAll(wrapClass)
  SQS.Tweak.watch(tweaks, onTweakChange)

  sync()
  events.on('resize', setThumbSize)

  return {
    sync: sync,
    destroy: destroy
  }

  function sync () {
    debug('sync')
    setThumbSize()
  }

  function destroy () {
    events.removeListener('resize', setThumbSize)
  }

  function onTweakChange (tweak) {
    debug(arguments, 'tweak change')
  }

  function setThumbSize (viewport = utils.getViewport()) {
    debug(viewport)

    /* TODO: get the computed navBar size*/

    const upperTarget = 4
    const lowerTarget = 2

    const navBars = 80
    const padding = 40

    const container = element.getBoundingClientRect().width || viewport.width

    const thumbSize = {
      width: 178,
      height: 230
    }

    const max = Math.min(Math.round(viewport.height * config.thumbRatio) - navBars, 480)

    debug(padding, 'padding')
    debug(max, 'max')
    /* TODO: big screeen thumbs */

    thumbSize.width = container / upperTarget
    thumbSize.width = thumbSize.width - padding
    thumbSize.width = Math.floor(thumbSize.width)
    debug(thumbSize.width, 'width')

    thumbSize.height = computeHeight()

    // if (thumbSize.height >= max) {
    //   debug(thumbSize.height, 'over max')

    //   thumbSize.width = config.thumbRatio * max
    //   thumbSize.width = thumbSize.width - padding
    //   thumbSize.width = Math.floor(thumbSize.width)
    //   debug(thumbSize.width, 'width')

    //   thumbSize.height = computeHeight()
    // }
    /* Round the sizes */

    /* Apply the new sizes */
    lodash.each(thumbnails, elem => {
      elem.style.width = `${thumbSize.width}px`
      elem.style.height = `${thumbSize.height}px`
    })
    lodash.each(wrappers, elem => {
      elem.style.width = `${thumbSize.width}px`
    })
    lodash.each(thumbnails, utils.loadImages)

    function computeHeight () {
      let height = (1 / config.thumbRatio) * thumbSize.width
      return Math.floor(height)
    }
  }
}
