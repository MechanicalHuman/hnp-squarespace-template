'use strict'

/* eslint-env browser */
/* TODO: Revamp this whole module */

const debug = require('debug')('hnp:ajax')

const config = require('./config')
const events = require('./events')
const utils = require('./utils')

var httpRequest
var ajaxFired = false
var currentEvent
var currentTarget

module.exports = AjaxLoader

/**
 *  Constructor
 *
 *  @constructor
 */
function AjaxLoader () {
  this.CONTENT = '[role="main"]'
  this.ANCHORS = config.ajax.anchors
  this.SITE_CONTAINER = config.mainContainer
  this.TIMEOUT = config.ajax.timeout
  this.ACTIVE_NAV_CLASS = config.ajax.activeNavClass
  this.initialize()
}

AjaxLoader.prototype = {
  initialize: initialize,
  bind: bind,
  bindAjaxAttr: bindAjaxAttr,
  walkUpDOM: walkUpDOM,
  bindLinks: bindLinks,
  findMetaTags: findMetaTags,
  bindMetaTags: bindMetaTags,
  modifyLinkState: modifyLinkState,
  modifierKeyPressed: modifierKeyPressed,
  hasSomeParentTheClass: hasSomeParentTheClass,
  fireRequest: fireRequest,
  ajax: ajax,
  handleRequest: handleRequest,
  handleTimeout: handleTimeout,
  createDummyDom: createDummyDom,
  updatePage: updatePage,
  initializeSqsBlocks: initializeSqsBlocks,
  destroySqsBlocks: destroySqsBlocks,
  refireTemplateControllers: refireTemplateControllers,
  updateHistory: updateHistory,
  replaceHistory: replaceHistory,
  bindPopState: bindPopState,
  scrollToPosition: scrollToPosition,

  isPageTransitionEnabled: isPageTransitionEnabled
}

function initialize () {
  // Storing our own scroll position, so we set this to manual.
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }

  this.replaceHistory()
  this.bind()
}
// Fires all the bind methods
function bind () {
  var body = document.body
  this.bindAjaxAttr(document)
  this.bindMetaTags(this.findMetaTags())

  body.addEventListener('click', this.bindLinks.bind(this))
  window.addEventListener('popstate', this.bindPopState.bind(this))
}

function bindAjaxAttr (parent) {
  if (!parent) {
    parent = document
  }

  document.body.dataset.ajaxLoader = 'loaded'

  var anchors = parent.querySelectorAll(this.ANCHORS)
  if (anchors.length <= 0) {
    return
  }

  for (var i = 0; i < anchors.length; i++) {
    anchors[i].dataset.ajaxLoader = 'ajax-loader-binded'
  }
}
// For event delegation - walk up the dom til you find an anchor tag
function walkUpDOM (element, tagName) {
  var currentElement = element
  while (currentElement !== null && currentElement.tagName !== tagName.toUpperCase()) {
    currentElement = currentElement.parentNode
  }
  return currentElement
}

function bindLinks (e) {
  var link = this.walkUpDOM(e.target || e.srcElement, 'A')
  if (link && link.getAttribute('data-ajax-loader') === 'ajax-loader-binded') {
    // If control, alt, or shift are press, return false and let default browser behavior happen
    if (this.modifierKeyPressed(e)) {
      return false
    }

    e.preventDefault()

    // If there's not already an ajax request in progress, do this
    if (!ajaxFired) {
      currentEvent = e
      currentTarget = e.target
      var url = link.getAttribute('href')
      this.fireRequest(url)
    }
  }
}

function findMetaTags (head) {
  if (!head) {
    head = document.head
  }

  var metaTagArray = Array.prototype.filter.call(head.childNodes, function (node) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return
    }

    var nodeName = node.nodeName.toUpperCase()
    var hasPropertyAttr = node.hasAttribute('property')
    var hasItempropAttr = node.hasAttribute('itemprop')
    var hasNameAttr = node.hasAttribute('name')
    var name
    if (hasNameAttr) {
      name = node.getAttribute('name')
    }
    var hasRelAttr = node.hasAttribute('rel')

    var isElement = ((nodeName === 'META' || (nodeName === 'LINK' && node.getAttribute('rel') === 'canonical')) && (hasPropertyAttr || hasItempropAttr || (hasNameAttr && name !== 'viewport') || hasRelAttr))

    return isElement
  })

  return metaTagArray
}

function bindMetaTags (arr) {
  arr.forEach(function (metaTag) {
    metaTag.setAttribute('data-ajax-meta', 'binded')
  })
}

function modifyLinkState (url) {
  Array.prototype.forEach.call(document.querySelectorAll('.' + this.ACTIVE_NAV_CLASS), function (el) {
    el.classList.remove(this.ACTIVE_NAV_CLASS)
  }.bind(this))

  Array.prototype.forEach.call(document.querySelectorAll('[href="' + url + '"]'), function (el) {
    el.parentNode.classList.add(this.ACTIVE_NAV_CLASS)
  }.bind(this))
}

function modifierKeyPressed (e) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
    return true
  }
  return false
}

function hasSomeParentTheClass (element, classname) {
  if (element.className && element.className.split && element.className.split(' ').indexOf(classname) >= 0) return true
  return element.parentNode && this.hasSomeParentTheClass(element.parentNode, classname)
}

function fireRequest (url) {
  ajaxFired = true
  events.emit('ajax:start')
  this.scrollToPosition(0, 0)
  this.modifyLinkState(url)
  utils.setExternalLinks()
  this.destroySqsBlocks()
  this.ajax(url)
}

function ajax (url) {
  httpRequest = new XMLHttpRequest()
  httpRequest.open('GET', url)
  httpRequest.timeout = this.TIMEOUT
  httpRequest.onreadystatechange = this.handleRequest.bind(this, url)
  httpRequest.ontimeout = this.handleTimeout.bind(this, url)
  httpRequest.send(null)
}

function handleRequest (url) {
  if (httpRequest.readyState === 4) {
    if (httpRequest.status === 200) {
      var pageData = this.createDummyDom(httpRequest.responseText)
      if (!pageData.container || !pageData.content) {
        this.handleTimeout(url)
      } else {
        // if the clicked link is the same as current page, don't update the history
        if (url !== window.location.pathname) {
          this.replaceHistory()
          this.updateHistory(url, document.querySelector('title').textContent)
        }
        this.updatePage(pageData)
      }
    } else {
      this.handleTimeout(url)
    }
  }
}

function handleTimeout (url) {
  ajaxFired = false
  debug(`Timed out, Redirecting to ${url}`)
  events.emit('ajax:end')
  window.location.href = url
}

function createDummyDom (data) {
  var html = document.createElement('html')
  html.innerHTML = data

  var bodyClasses = html.querySelector('body').classList
  var docTitle = html.querySelector('title').textContent
  var head = html.querySelector('head')
  var headMeta = this.findMetaTags(head)

  this.bindMetaTags(headMeta)

  var docFrag = document.createDocumentFragment()

  Array.prototype.forEach.call(headMeta, function (node) {
    docFrag.appendChild(node)
  })

  var bodyId = html.querySelector('body').id

  this.bindAjaxAttr(html)

  var dataObj = {
    newHeadChildren: docFrag,
    docTitle: docTitle,
    bodyClasses: bodyClasses,
    bodyId: bodyId,
    content: html.querySelector(this.CONTENT) ? html.querySelector(this.CONTENT).outerHTML : null,
    container: html.querySelector(this.SITE_CONTAINER) ? html.querySelector(this.SITE_CONTAINER).innerHTML : null
  }

  html = null

  return dataObj
}

function updatePage (data) {
  var body = document.querySelector('body')
  var head = document.querySelector('head')

  Array.prototype.forEach.call(head.querySelectorAll('[data-ajax-meta="binded"]'), function (node) {
    head.removeChild(node)
  })

  head.appendChild(data.newHeadChildren)

  document.title = data.docTitle
  body.className = data.bodyClasses
  body.id = data.bodyId

  document.querySelector(this.SITE_CONTAINER).innerHTML = data.container

  this.initializeSqsBlocks()
  this.refireTemplateControllers()

  // Determine scroll position - if coming from a link click, go to top, else, scroll to history position
  if (currentEvent.type === 'click') this.replaceHistory()
  ajaxFired = false
  events.emit('ajax:end')
}

function initializeSqsBlocks () {
  window.SQS.Lifecycle.init()
}

function destroySqsBlocks () {
  window.SQS.Lifecycle.destroy()
  httpRequest = null
}

/** Refires the SQS controllers */
function refireTemplateControllers () {
  if (window.SQSControllerSync) {
    window.SQSControllerSync()
  }
}

function updateHistory (url, docTitle) {
  var state = {
    url: url,
    search: window.location.search,
    docTitle: docTitle,
    position: {
      x: window.scrollX,
      y: window.scrollY
    }
  }
  window.history.pushState(state, docTitle, url)
}

function replaceHistory () {
  window.history.replaceState({
    url: window.location.pathname,
    search: window.location.search,
    docTitle: document.title,
    position: {
      x: window.scrollX,
      y: window.scrollY
    }
  }, document.title, window.location.pathname + window.location.search)
}

function bindPopState (e) {
  if (!e.state) {
    // If there's no state property on the event, do nothing
    // because Safari treats initial page load as a popstate.
  } else if (!ajaxFired) {
    currentEvent = e
    this.fireRequest(e.state.url + e.state.search)
  } else {
    console.log('uh oh something wrong with bindPopState')
  }
}

function scrollToPosition (x, y) {
  window.scrollTo(x, y)
}

function isPageTransitionEnabled () {
  if (document.body.classList.contains(this.pageTransition.animClass)) {
    return true
  }
  return false
}
