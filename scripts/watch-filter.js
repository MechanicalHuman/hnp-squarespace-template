'use strict'

module.exports = filter

const pathRegexp = /\/assets|\/scripts|\/styles/i

function filter (arg) {
  return !pathRegexp.test(arg)
}
