'use strict'

module.exports = {}

const lodash = require('lodash')
const utils = require('./utils')

const additionalTests = {
  notifications: hasNotifications,
  mobilesafari: isMobileSafari
}

const skipRegEx = /(^wf)|(^yui)|(^js)|(^portrait)|(^landscape)/gi

var testResults = []

// Perform the additionalTests and add them to the rootElement Class list
lodash.forEach(additionalTests, appendToRootClass)

// Get the tests results from the rootElement Class list (retrieves modernizer)
testResults = document.documentElement.className.split(' ')
testResults = testResults.map(key => key.trim())
testResults = testResults.filter(key => !key.match(skipRegEx))
testResults = testResults.forEach(addToExports)

/**
 *
 * Appends the given key to the documentElement class list based on the result
 *  of the test. If the test is negative it will add 'no-key'. (Emulates Modernizer behavior)
 *
 * @method    appendToRootClass
 * @param     {Function}           test    Must return a boolean
 * @param     {String}             key     Name of the class to be appended
 */

function appendToRootClass (test, key) {
  if (test()) {
    utils.addClass(document.documentElement, key)
  } else {
    utils.addClass(document.documentElement, `no-${key}`)
  }
}

/**
 * Adds the given key to the 'module.exports' object as a boolean
 *
 * @method    addToCapabilities
 * @param     {String}        key
 */

function addToExports (key) {
  const regExp = /^no-/
  if (key.match(regExp)) {
    key = key.replace(regExp, '')
    module.exports[key] = false
  } else {
    module.exports[key] = true
  }
}

/* Tests */
function hasNotifications () {
  return Boolean('Notification' in window)
}

function isMobileSafari () {
  return Boolean((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)))
}
