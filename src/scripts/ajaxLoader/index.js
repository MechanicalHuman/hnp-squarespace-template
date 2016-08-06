'use strict'

const Constructor = require('./constructor')
const config = require('../config')

module.exports = {}
module.exports.init = init
module.exports.config = config
module.exports.Constructor = Constructor

function init () {
  if (!config.useAjax) return
  return new Constructor(require('./config'))
}
