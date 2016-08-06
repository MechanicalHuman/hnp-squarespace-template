'use strict'

const proto = require('./prototype')

module.exports = AjaxLoader

/**
 *  Constructor
 *
 *  @constructor
 */
function AjaxLoader (config) {
  if (!config) {
    config = {}
  }

  this.CONTENT = config.content || '[role="main"]'
  this.ANCHORS = config.anchors || 'a[href]:not([href^="http"]):not([href^="#"]):not([href^="/#"]):not([href^="/commerce"]):not([href^="mailto"]):not([href^="tel"]):not([href^="javascript"]):not(.nav-item-splash-page)'
  this.SITE_CONTAINER = config.siteContainer || null
  this.TIMEOUT = window.parseInt(config.timeout, 10) || 5000
  this.SQS_CONTROLLER = config.sqsController || false
  this.RUN_ON_LOGIN = config.runOnLogin || false
  this.ACTIVE_NAV_CLASS = config.activeNavClass || 'active'
  this.pageTransition = {
    animLink: config.pageTransition.animLink || null,
    animClass: config.pageTransition.animClass || null,
    fadeInDuration: config.pageTransition.fadeInDuration || 0.78,
    fadeOutDuration: config.pageTransition.fadeOutDuration || 0.20
  }
  this.beforeRequestAnim = config.beforeRequestAnim || null
  this.afterRequestAnim = config.afterRequestAnim || null

  this.initialize()
}

AjaxLoader.prototype = proto
