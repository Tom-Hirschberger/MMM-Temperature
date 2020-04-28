/* global Module

/* Magic Mirror
 * Module: Temperature
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register('MMM-Temperature', {

  defaults: {
    animationSpeed: 500,
  },

  getStyles: function() {
    return ['temperature.css']
  },

  getDom: function() {
    const wrapper = document.createElement('div')
    return wrapper;
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.sendSocketNotification('CONFIG', this.config)
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
  },

  notificationReceived: function (notification, payload) {
    const self = this
  }
})
