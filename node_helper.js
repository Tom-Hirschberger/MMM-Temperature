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
        // else {
        //   console.log("Skipping sensor with id: "+curSensorId+ " because it is an notification based sensor!")
        // }
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
      cur_valuec = ((cur_valuef - 32) / 1.8).toFixed(self.config.fractionCount)

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
    } else if (notification.startsWith("WIND_SPEED_AVG_")){
      cur_id = notification.substring(15)
      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["wind_avg_m_s"] = payload
    } else if (notification.startsWith("WIND_SPEED_MAX_")){
      cur_id = notification.substring(15)
      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["wind_max_m_s"] = payload
    } else if (notification.startsWith("WIND_DIRECTION_")){
      cur_id = notification.substring(15)
      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["wind_dir_deg"] = payload
    } else if (notification.startsWith("RAIN_")){
      cur_id = notification.substring(5)
      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["rain_mm"] = payload
    } else if (notification.startsWith("UV_")){
      cur_id = notification.substring(3)
      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["uv"] = payload
    } else if (notification.startsWith("LIGHT_")){
      cur_id = notification.substring(6)
      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      self.sensorValues[cur_conf_id]["light_lux"] = payload
    } else if (notification.startsWith("TEMPERATURE_VALUES_")){
      cur_id = notification.substring(19)

      cur_conf_id = self.notificationSensors[cur_id]
      if(typeof self.sensorValues[cur_conf_id] === "undefined"){
        self.sensorValues[cur_conf_id] = {"error":false}
      }

      self.sensorValuesUseCount[cur_conf_id] = 0

      try {
        curValues = JSON.parse(payload)

        // console.log("Parsed values: ")
        // console.log(JSON.stringify(curValues))

        for (var key in curValues){
          curValues[key.toLowerCase()] = curValues[key]
        }

        // console.log("Parsed values after lowerCase transform: ")
        // console.log(JSON.stringify(curValues))
        
        if (typeof curValues["humidity"] !== "undefined"){
          // console.log("Updating humidity")
          self.sensorValues[cur_conf_id]["humidity"] = (curValues["humidity"]*1).toFixed(self.config.fractionCount)
        } else {
          // console.log("Missing humidity")
          delete(self.sensorValues[cur_conf_id]["humidity"])
        }
        
        if (typeof curValues["temperature_c"] !== "undefined"){
          // console.log("Updating temperature_c")
          self.sensorValues[cur_conf_id]["temperature_c"] = (curValues["temperature_c"]*1).toFixed(self.config.fractionCount)
          if (! ("temperature_f" in curValues)){
            self.sensorValues[cur_conf_id]["temperature_f"] = ((self.sensorValues[cur_conf_id]["temperature_c"] * 1.8) + 32).toFixed(self.config.fractionCount)
          }
          if(self.config.useCelsius){
            self.sensorValues[cur_conf_id]["temperature"] = self.sensorValues[cur_conf_id]["temperature_c"]
          } else {
            self.sensorValues[cur_conf_id]["temperature"] = self.sensorValues[cur_conf_id]["temperature_f"]
          }
        } else {
          // console.log("Missing temperature_c")
          delete(self.sensorValues[cur_conf_id]["temperature_c"])
        }

        if (typeof curValues["temperature_f"] !== "undefined"){
          // console.log("Updating temperature_f")
          self.sensorValues[cur_conf_id]["temperature_f"] = (curValues["temperature_f"]*1).toFixed(self.config.fractionCount)
          if (! ("temperature_c" in curValues)){
            self.sensorValues[cur_conf_id]["temperature_c"] = ((self.sensorValues[cur_conf_id]["temperature_f"] - 32) / 1.8).toFixed(self.config.fractionCount)
          }
          if(self.config.useCelsius){
            self.sensorValues[cur_conf_id]["temperature"] = self.sensorValues[cur_conf_id]["temperature_c"]
          } else {
            self.sensorValues[cur_conf_id]["temperature"] = self.sensorValues[cur_conf_id]["temperature_f"]
          }
        } else {
          // console.log("Missing temperature_f")
          delete(self.sensorValues[cur_conf_id]["temperature_f"])
        }

        if (typeof curValues["wind_avg_m_s"] !== "undefined"){
          // console.log("Updating wind_avg_m_s")
          self.sensorValues[cur_conf_id]["wind_avg_m_s"] = (curValues["wind_avg_m_s"]*1).toFixed(self.config.fractionCount)
        } else {
          // console.log("Missing wind_avg_m_s")
          delete(self.sensorValues[cur_conf_id]["wind_avg_m_s"])
        }

        if (typeof curValues["wind_max_m_s"] !== "undefined"){
          // console.log("Updating wind_max_m_s")
          self.sensorValues[cur_conf_id]["wind_max_m_s"] = (curValues["wind_max_m_s"]*1).toFixed(self.config.fractionCount)
        } else {
          // console.log("Missing wind_max_m_s")
          delete(self.sensorValues[cur_conf_id]["wind_max_m_s"])
        }

        if (typeof curValues["wind_dir_deg"] !== "undefined"){
          // console.log("Updating wind_dir_deg")
          self.sensorValues[cur_conf_id]["wind_dir_deg"] = curValues["wind_dir_deg"]
        } else {
          // console.log("Missing wind_dir_deg")
          delete(self.sensorValues[cur_conf_id]["wind_dir_deg"])
        }

        if (typeof curValues["rain_mm"] !== "undefined"){
          // console.log("Updating rain_mm")
          self.sensorValues[cur_conf_id]["rain_mm"] = (curValues["rain_mm"]*1).toFixed(self.config.fractionCount)
        } else {
          // console.log("Missing rain_mm")
          delete(self.sensorValues[cur_conf_id]["rain_mm"])
        }

        if (typeof curValues["uv"] !== "undefined"){
          // console.log("Updating uv")
          self.sensorValues[cur_conf_id]["uv"] = curValues["uv"]
        } else {
          // console.log("Missing uv")
          delete(self.sensorValues[cur_conf_id]["uv"])
        }

        if (typeof curValues["light_lux"] !== "undefined"){
          // console.log("Updating light_lux")
          self.sensorValues[cur_conf_id]["light_lux"] = curValues["light_lux"]
        } else {
          // console.log("Missing light_lux")
          delete(self.sensorValues[cur_conf_id]["light_lux"])
        }
      } catch (err) {
        console.log(self.name+" Can not parse output of notification of sensor with id "+cur_conf_id+" ("+self.config.sensors[cur_conf_id].name+"): "+payload)
        console.log(err)
        self.sensorValues[cur_conf_id] = {}
        self.sensorValues[cur_conf_id]["error"] = true
      }

      // console.log("Saved new values of id: "+cur_id)
      // console.log(JSON.stringify(self.sensorValues[cur_id]))
      
    }
    else {
      console.log(this.name + ': Received Notification: ' + notification)
    }
  }
})
