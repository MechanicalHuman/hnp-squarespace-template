'use strict'

module.exports = filter

const pathRegexp = /\/scripts|\/styles|\/.git/i

function filter (arg) {
  return !pathRegexp.test(arg)
}
