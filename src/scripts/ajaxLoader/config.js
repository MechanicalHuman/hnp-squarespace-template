'use strict'

const config = require('../config')

module.exports = {
  content: '[role="main"]',
  anchors: 'a[href]:not([href^="http"]):not([href^="#"]):not([href^="/#"]):not([href^="/commerce"]):not([href^="mailto"]):not([href^="tel"]):not([href^="javascript"]):not(.nav-item-splash-page)',
  siteContainer: config.mainContainer,
  timeout: 6000,
  sqsController: true,
  runOnLogin: false,
  activeNavClass: 'active',
  pageTransition: {
    animLink: 'transition-link',
    animClass: 'transition-animation',
    fadeInDuration: 0.78,
    fadeOutDuration: 0.2
  },
  beforeRequestAnim: beforeRequestAnim,
  afterRequestAnim: afterRequestAnim
}

function beforeRequestAnim () {
  // let container = document.querySelector(config.mainContainer)
  // container.classList.add('slide-up')
}

function afterRequestAnim () {
  // let container = document.querySelector(config.mainContainer)
  // container.classList.remove('slide-up')
  // container.classList.add('slide-into-view')
  // setTimeout(() => container.classList.remove('slide-into-view'), 500)
}
