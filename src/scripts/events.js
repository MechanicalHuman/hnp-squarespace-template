'use strict'

const EventEmitter = require('events')

class Events extends EventEmitter {
}

Events.prototype.debug = require('debug')('hnp:events')

module.exports = new Events()
