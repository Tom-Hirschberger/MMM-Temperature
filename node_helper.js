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
const scriptsDir = path.join(__dirname, '/scripts')

module.exports = NodeHelper.create({

  start: function () {
    this.started = false
    this.sensorValues = []
  },

  updateSensorValues () {
    const self = this
    console.log(self.name+": Updating sensor values")

    for(let curSensorId = 0; curSensorId < self.config.sensors.length; curSensorId++){
      let curScript = self.config.defaultScript
      let curArgs = self.config.defaultArgs
      if(typeof self.config.sensors[curSensorId].script !== "undefined"){
        curScript = self.config.sensors[curSensorId].script
      }

      curScript = scriptsDir+"/"+curScript

      if(typeof self.config.sensors[curSensorId].args !== "undefined"){
        curArgs = self.config.sensors[curSensorId].args
      }

      let output = execSync(curScript+" "+curArgs)
      if(typeof output !== "undefined"){
        curValues = JSON.parse(output)

        if(curValues.error){
          self.sensorValues[curSensorId] =  {}
          console.log(this.name+": Error while reading data of sensor with id "+curSensorId+"!")
        } else {
          self.sensorValues[curSensorId] = curValues

          if(self.config.useCelsius){
            curValues["temperature"] = curValues["temperature_c"].toFixed(self.config.fractionCount)
          } else {
            curValues["temperature"] = curValues["temperature_f"].toFixed(self.config.fractionCount)
          }

          if(typeof curValues.humidity !== "undefined"){
            curValues.humidity = curValues.humidity.toFixed(self.config.fractionCount)
          }

          console.log(this.name+": New Values of sensor with id "+curSensorId+": "+JSON.stringify(curValues))
        }
      }
    }

    self.sendSocketNotification("TEMPERATURE_UPDATE", {values: self.sensorValues})
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if (notification === 'CONFIG' && self.started === false) {
      self.config = payload
      self.started = true
    } else if (notification === "UPDATE_SENSOR_VALUES"){
      self.updateSensorValues()
    } else {
      console.log(this.name + ': Received Notification: ' + notification)
    }
  }
})
