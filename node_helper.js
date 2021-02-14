/* Magic Mirror
 * Module: Temperature
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
    this.sensorValuesUseCount = []
    this.notificationSensors = {}
  },

  updateSensorValues () {
    const self = this
    console.log(self.name+": Updating sensor values")

    for(let curSensorId = 0; curSensorId < self.config.sensors.length; curSensorId++){

      if (typeof self.sensorValues[curSensorId] === "undefined"){
        self.sensorValues[curSensorId] = {"error":false}
      }

      if (
        (typeof self.config.sensors[curSensorId].useValuesCnt === "undefined") ||
        (typeof self.sensorValues[curSensorId].temperature === "undefined") ||
        (typeof self.sensorValues[curSensorId].humidity === "undefined") ||
        (typeof self.sensorValuesUseCount[curSensorId] === "undefined") ||
        (self.sensorValuesUseCount[curSensorId] >= self.config.sensors[curSensorId].useValuesCnt)
      ){
        if (typeof self.config.sensors[curSensorId].notificationId === "undefined") {
          self.sensorValuesUseCount[curSensorId] = 1
          let curScript = self.config.defaultScript
          let curArgs = self.config.defaultArgs
          if(typeof self.config.sensors[curSensorId].script !== "undefined"){
            curScript = self.config.sensors[curSensorId].script
          }

          if(curScript.indexOf("/") !== 0){
            curScript = scriptsDir+"/"+curScript
          }

          if(typeof self.config.sensors[curSensorId].args !== "undefined"){
            curArgs = self.config.sensors[curSensorId].args
          }

          self.sensorValues[curSensorId] =  {}

          console.log(self.name+" Calling: "+curScript+" "+curArgs)

          let output = null
          try{
            if(typeof self.config.sensors[curSensorId].timeout !== "undefined"){
              output = execSync(curScript+" "+curArgs, timeout=self.config.sensors[curSensorId].timeout)
            } else {
              output = execSync(curScript+" "+curArgs)
            }
          } catch (err){
            output = null
          }
          
          if(output !== null){
            try {
              curValues = JSON.parse(output)
              console.log(JSON.stringify(curValues))
            } catch (err) {
              console.log(self.name+" Can not parse output of sensor with id "+curSensorId+" ("+self.config.sensors[curSensorId].name+"): "+output)
              curValues = {}
              curValues["error"] = true
            }

            if(curValues.error){
              console.log(this.name+": Error while reading data of sensor with id "+curSensorId+" ("+self.config.sensors[curSensorId].name+")!")
            } else {
              if(self.config.useCelsius){
                if(typeof curValues.temperature_c === "undefined"){
                  if(typeof curValues.temperature_f !== "undefined"){
                    curValues.temperature_c = (curValues.temperature_f - 32.0) / 1.8
                    curValues["temperature"] = curValues["temperature_c"].toFixed(self.config.fractionCount)
                  }
                } else {
                  curValues["temperature"] = curValues["temperature_c"].toFixed(self.config.fractionCount)
                }
              } else {
                if(typeof curValues.temperature_f === "undefined"){
                  if(typeof curValues.temperature_c !== "undefined"){
                    curValues.temperature_f = (curValues.temperature_c * 1.8) + 32
                    curValues["temperature"] = curValues["temperature_f"].toFixed(self.config.fractionCount)
                  }
                } else {
                  curValues["temperature"] = curValues["temperature_f"].toFixed(self.config.fractionCount)
                }
              }

              curValues["temperature_f"] = curValues["temperature_f"].toFixed(self.config.fractionCount)
              curValues["temperature_c"] = curValues["temperature_c"].toFixed(self.config.fractionCount)

              if(typeof curValues.humidity !== "undefined"){
                curValues.humidity = curValues.humidity.toFixed(self.config.fractionCount)
              }

              self.sensorValues[curSensorId] = curValues
              console.log(this.name+": New Values of sensor with id "+curSensorId+" ("+self.config.sensors[curSensorId].name+"): "+JSON.stringify(curValues))
            }
          }
        }
      } else {
        if (typeof self.config.sensors[curSensorId].name !== "undefined"){
          console.log("Re-Using value of sensor with name: "+self.config.sensors[curSensorId].name)
        } else {
          console.log("Re-Using value of sensor with id: "+curSensorId)
        }

        if(typeof self.sensorValuesUseCount[curSensorId] !== "undefined"){
          self.sensorValuesUseCount[curSensorId] += 1
        } else {
          self.sensorValuesUseCount[curSensorId] = 1
        }
      }
    }

    console.log("Sending temp update: "+JSON.stringify(self.sensorValues))

    self.sendSocketNotification("TEMPERATURE_UPDATE", {values: self.sensorValues})

    for(let curSensorId in self.notificationSensors){
      curNotiId = self.notificationSensors[curSensorId];
      if (
        (typeof self.config.sensors[curNotiId].useValuesCnt === "undefined") ||
        (self.sensorValuesUseCount[curNotiId] >= self.config.sensors[curNotiId].useValuesCnt)
      ){
        if (typeof self.config.sensors[curNotiId].name !== "undefined"){
          console.log("Removing values of sensor with name: "+self.config.sensors[curNotiId].name)
        } else {
          console.log("Removing values of sensor with id: "+curNotiId)
        }
        self.sensorValues[curNotiId] = {"error":false}
      }
    }
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if (notification === 'CONFIG' && self.started === false) {
      self.config = payload
      self.started = true
      for(let curSensorId = 0; curSensorId < self.config.sensors.length; curSensorId++){
        if (typeof self.config.sensors[curSensorId].notificationId !== "undefined") {
          self.notificationSensors[self.config.sensors[curSensorId].notificationId] = curSensorId 
        }
      }
    } else if (notification === "UPDATE_SENSOR_VALUES"){
      self.updateSensorValues()
    } else if (notification.startsWith("TEMPERATURE_C_")){
      cur_id = notification.substring(14)
      cur_valuec = (payload*1).toFixed(self.config.fractionCount)
      cur_valuef = ((cur_valuec * 1.8) + 32).toFixed(self.config.fractionCount)

      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["temperature_c"] = cur_valuec
      self.sensorValues[cur_conf_id]["temperature_f"] = cur_valuef
      if(self.config.useCelsius){
        self.sensorValues[cur_conf_id]["temperature"] = self.sensorValues[cur_conf_id]["temperature_c"]
      } else {
        self.sensorValues[cur_conf_id]["temperature"] = self.sensorValues[cur_conf_id]["temperature_f"]
      }
    } else if (notification.startsWith("TEMPERATURE_F_")){
      cur_id = notification.substring(14)
      cur_valuef = payload
      cur_valuec = (cur_valuef - 32) / 1.8

      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["temperature_c"] = cur_valuec
      self.sensorValues[cur_conf_id]["temperature_f"] = cur_valuef

      if(self.config.useCelsius){
        self.sensorValues[cur_conf_id]["temperature"] = self.sensorValues[cur_conf_id]["temperature_c"]
      } else {
        self.sensorValues[cur_conf_id]["temperature"] = self.sensorValues[cur_conf_id]["temperature_f"]
      }
    } else if (notification.startsWith("HUMIDITY_")){
      cur_id = notification.substring(9)
      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["humidity"] = (payload*1).toFixed(self.config.fractionCount)
    }
    else {
      console.log(this.name + ': Received Notification: ' + notification)
    }
  }
})
