/* Magic Mirror
 * Module: Screen-Powersave-Notification
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')
const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')

module.exports = NodeHelper.create({

  start: function () {
    this.started = false
  },

  runScriptsInDirectory (directory) {
    const self = this
    console.log(self.name + ': Running all scripts in: ' + directory)
    fs.readdir(directory, function (err, items) {
      if (err) {
        console.log(err)
      } else {
        for (var i = 0; i < items.length; i++) {
          console.log(self.name + ':   ' + items[i])
          exec(directory + '/' + items[i], function (error, stdout, stderr) {
            if (error) {
              console.log(stderr)
            }
          })
        }
      }
    })
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if (notification === 'CONFIG' && self.started === false) {
      self.config = payload
      self.started = true
    } else {
      console.log(this.name + ': Received Notification: ' + notification)
    }
  }
})
