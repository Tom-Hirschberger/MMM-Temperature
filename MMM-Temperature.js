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
    updateInterval: 60,
    useCelsius: true,
    temperatureText: "Temperature:",
    humidityText: "Humidity: ",
    sensors: [],
    defaultScript: "htu21",
    defaultArgs: "",
    fractionCount: 1
  },

  getStyles: function() {
    return ['temperature.css']
  },

  getDom: function() {
    const self = this
    const wrapper = document.createElement('div')
      wrapper.className = "temperatureRootWrapper"
      for(let curSensorId = 0; curSensorId < self.config.sensors.length; curSensorId++){
        var sensorWrapper = document.createElement("div")
          if(typeof self.config.sensors[curSensorId].name !== "undefined"){
            sensorWrapper.className = "sensor " + self.config.sensors[curSensorId].name
          } else {
            sensorWrapper.className = "sensor"
          }

          var sensorInnerWrapper = document.createElement("div")
            sensorInnerWrapper.className = "sensorWrapper"

            if(typeof self.config.sensors[curSensorId].name !== "undefined"){
              var nameWrapper = document.createElement("div")
                nameWrapper.className = "name"

                var nameInnerWrapper = document.createElement("div")
                  nameInnerWrapper.className = "nameWrapper"
                  nameInnerWrapper.innerHTML = self.config.sensors[curSensorId].name
                nameWrapper.appendChild(nameInnerWrapper)
              sensorInnerWrapper.appendChild(nameWrapper)
            }

            var tempWrapper = document.createElement("div")
              tempWrapper.className = "temperature"
              var tempInnerWrapper = document.createElement("div")
                tempInnerWrapper.className = "temperatureWrapper"

                var tempDescription = document.createElement("div")
                  tempDescription.className = "description"
                  tempDescription.innerHTML = self.config.temperatureText
                tempInnerWrapper.appendChild(tempDescription)

                var tempValueWrapper = document.createElement("div")
                  tempValueWrapper.className = "valueWrapper"
                  var tempValue = document.createElement("div")
                    tempValue.className = "value"
                    if(
                      (typeof self.values[curSensorId] !== "undefined") &&
                      (typeof self.values[curSensorId].temperature !== "undefined")){
                      tempValue.innerHTML = self.values[curSensorId].temperature
                    } else {
                      tempValue.innerHTML = "na"
                    }
                  tempValueWrapper.appendChild(tempValue)

                  var tempUnit = document.createElement("div")
                    tempUnit.className = "unit"
                    if(self.config.useCelsius){
                      tempUnit.innerHTML = "°C"
                    } else {
                      tempUnit.innerHTML = "°F"
                    }
                  tempValueWrapper.appendChild(tempUnit)
                tempInnerWrapper.appendChild(tempValueWrapper)
            tempWrapper.appendChild(tempInnerWrapper)
            sensorInnerWrapper.appendChild(tempWrapper)

            var humidityWrapper = document.createElement("div")
              humidityWrapper.className = "humidity"
              var humidityInnerWrapper = document.createElement("div")
                humidityInnerWrapper.className = "humidityWrapper"

                var humidityDescription = document.createElement("div")
                  humidityDescription.className = "description"
                  humidityDescription.innerHTML = self.config.humidityText
                  humidityInnerWrapper.appendChild(humidityDescription)


                var humidityValueWrapper = document.createElement("div")
                  humidityValueWrapper.className = "valueWrapper"
                  var humidityValue = document.createElement("div")
                    humidityValue.className = "value"
                    if(
                      (typeof self.values[curSensorId] !== "undefined") &&
                      (typeof self.values[curSensorId].humidity !== "undefined")){
                      humidityValue.innerHTML = self.values[curSensorId].humidity
                    } else {
                      humidityValue.innerHTML = "na"
                    }
                  humidityValueWrapper.appendChild(humidityValue)

                  var humidityUnit = document.createElement("div")
                    humidityUnit.className = "unit"
                    humidityUnit.innerHTML = "&nbsp;%"
                  humidityValueWrapper.appendChild(humidityUnit)
              humidityInnerWrapper.appendChild(humidityValueWrapper)
            humidityWrapper.appendChild(humidityInnerWrapper)
          sensorInnerWrapper.appendChild(humidityWrapper)
        sensorWrapper.appendChild(sensorInnerWrapper)

        wrapper.appendChild(sensorWrapper)
      }
    return wrapper;
  },

  start: function () {
    const self = this
    self.values = []
    Log.info("Starting module: " + self.name);
    self.sendSocketNotification('CONFIG', self.config)
    self.sendRequestAndResetTimer();
  },

  sendRequestAndResetTimer(){
    const self = this
    if(self.refreshTimer){
      clearTimeout(self.refreshTimer)
      refreshTimer = null
    }
    self.sendSocketNotification("UPDATE_SENSOR_VALUES")
    self.refreshTimer = setTimeout(()=>{
      self.sendRequestAndResetTimer()
    }, self.config.updateInterval * 1000)
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if(notification === "TEMPERATURE_UPDATE"){
      self.values = payload.values
      self.updateDom(self.config.animationSpeed)
    }
  },
})
