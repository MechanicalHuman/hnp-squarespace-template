'use strict'

const EventEmitter = require('events')

class HNPEvents extends EventEmitter {

}

HNPEvents.prototype.debug = require('debug')('hnp:events')

module.exports = new EventEmitter()
