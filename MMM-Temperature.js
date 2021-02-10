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
    showHumidiy: true,
    showTemperature: true,
    sensors: [],
    defaultScript: "htu21",
    defaultArgs: "",
    fractionCount: 1,
    onlyUpdateIfValuesChanged: true,
    temperatureLow: -1000,
    temperatureHigh: 1000,
    humidityLow: -1,
    humidityHigh: 101,
  },

  getStyles: function() {
    return ['temperature.css']
  },

  getDom: function() {
    const self = this
    const wrapper = document.createElement('div')
      wrapper.className = "temperatureRootWrapper"
      for(let curSensorId = 0; curSensorId < self.config.sensors.length; curSensorId++){
        self.valuesObjs[curSensorId] = []
        var sensorWrapper = document.createElement("div")
          if(typeof self.config.sensors[curSensorId].name !== "undefined"){
            sensorWrapper.className = "sensor " + self.config.sensors[curSensorId].name
          } else {
            sensorWrapper.className = "sensor"
          }

          let lowValue = false
          let highValue = false
          let naValue = false

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

            let valueToCheck = self.config.showTemperature
            if(typeof self.config.sensors[curSensorId].showTemperature !== "undefined"){
              valueToCheck = self.config.sensors[curSensorId].showTemperature
            }
            if (valueToCheck){
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
                      let curClassName = "value"
                      self.valuesObjs[curSensorId].temperature = tempValue
                    var tempUnit = document.createElement("div")
                      tempUnit.className = "unit"
                      if(self.config.useCelsius){
                        tempUnit.innerHTML = "°C"
                      } else {
                        tempUnit.innerHTML = "°F"
                      }

                      if(
                        (typeof self.values[curSensorId] !== "undefined") &&
                        (typeof self.values[curSensorId].temperature !== "undefined")){
                        tempValue.innerHTML = self.values[curSensorId].temperature
                        curClassName += " valid"
                        tempWrapper.className += " valid"
                        tempDescription.className += " valid"
                        tempValueWrapper.className += " valid"
                        valueToCheck = self.config.temperatureLow
                        if(typeof self.config.sensors[curSensorId].temperatureLow !== "undefined"){
                          valueToCheck = self.config.sensors[curSensorId].temperatureLow
                        }

                        if (self.values[curSensorId].temperature <= valueToCheck) {
                          curClassName += " low"
                          tempWrapper.className += " low"
                          tempDescription.className += " low"
                          tempValueWrapper.className += " low"
                          tempUnit.className += " low"
                          lowValue = true
                        }

                        valueToCheck = self.config.temperatureHigh
                        if(typeof self.config.sensors[curSensorId].temperatureHigh !== "undefined"){
                          valueToCheck = self.config.sensors[curSensorId].temperatureHigh
                        }

                        console.log("####Sensor: "+self.config.sensors[curSensorId].name+" ValueHigh: "+valueToCheck)

                        if (self.values[curSensorId].temperature >= valueToCheck){
                          curClassName += " high"
                          tempWrapper.className += " high"
                          tempDescription.className += " high"
                          tempValueWrapper.className += " high"
                          tempUnit.className += " high"
                          highValue = true
                        }
                      } else {
                        tempValue.innerHTML = "na"
                        tempWrapper.className += " na"
                        tempDescription.className += " na"
                        tempValueWrapper.className += " na"
                        tempUnit.className += " na"
                        curClassName += " invalid"
                        naValue = true
                      }
                      tempValue.className = curClassName
                    
                    tempValueWrapper.appendChild(tempValue)
                    tempValueWrapper.appendChild(tempUnit)
                  tempInnerWrapper.appendChild(tempValueWrapper)
              tempWrapper.appendChild(tempInnerWrapper)
              sensorInnerWrapper.appendChild(tempWrapper)
            }
            
            valueToCheck = self.config.showHumidiy
            if(typeof self.config.sensors[curSensorId].showHumidiy !== "undefined"){
              valueToCheck = self.config.sensors[curSensorId].showHumidiy
            }

            if(valueToCheck){
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
                      curClassName = "value"
                      self.valuesObjs[curSensorId].humidity = humidityValue

                      var humidityUnit = document.createElement("div")
                        humidityUnit.className = "unit"
                        humidityUnit.innerHTML = "&nbsp;%"

                      if(
                        (typeof self.values[curSensorId] !== "undefined") &&
                        (typeof self.values[curSensorId].humidity !== "undefined")){
                        humidityValue.innerHTML = self.values[curSensorId].humidity
                        curClassName += " valid"

                        valueToCheck = self.config.humidityLow
                        if(typeof self.config.sensors[curSensorId].humidityLow !== "undefined"){
                          valueToCheck = self.config.sensors[curSensorId].humidityLow
                        }

                        if (self.values[curSensorId].humidity <= valueToCheck) {
                          curClassName += " low"
                          humidityWrapper.className += " low"
                          humidityDescription.className += " low"
                          humidityValueWrapper.className += " low"
                          humidityUnit.className += " low"
                          lowValue = true
                        }

                        valueToCheck = self.config.humidityHigh
                        if(typeof self.config.sensors[curSensorId].humidityHigh !== "undefined"){
                          valueToCheck = self.config.sensors[curSensorId].humidityHigh
                        }

                        if (self.values[curSensorId].humidity >= valueToCheck) {
                          curClassName += " high"
                          humidityWrapper.className += " high"
                          humidityDescription.className += " high"
                          humidityValueWrapper.className += " high"
                          humidityUnit.className += " high"
                          highValue = true
                        }
                      } else {
                        humidityValue.innerHTML = "na"
                        curClassName += " na"
                        humidityWrapper.className += " na"
                        humidityDescription.className += " na"
                        humidityValueWrapper.className += " na"
                        humidityUnit.className += " na"
                        naValue = true
                      }
                      humidityValue.className = curClassName

                    humidityValueWrapper.appendChild(humidityValue)
                    humidityValueWrapper.appendChild(humidityUnit)
                humidityInnerWrapper.appendChild(humidityValueWrapper)
              humidityWrapper.appendChild(humidityInnerWrapper)
            sensorInnerWrapper.appendChild(humidityWrapper)
          }
        sensorWrapper.appendChild(sensorInnerWrapper)

        if(lowValue){
          sensorWrapper.className = sensorWrapper.className += " low"
        }

        if(highValue){
          sensorWrapper.className = sensorWrapper.className += " high"
        }

        if(naValue){
          sensorWrapper.className = sensorWrapper.className += " na"
        } else {
          sensorWrapper.className = sensorWrapper.className += " valid"
        }

        wrapper.appendChild(sensorWrapper)
      }
    return wrapper;
  },

  start: function () {
    const self = this
    self.values = []
    self.valuesObjs = []
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

  notificationReceived: function (notification, payload) {
    const self = this
    if (notification.startsWith("TEMPERATURE_C_") ||
        notification.startsWith("TEMPERATURE_F_") ||
        notification.startsWith("HUMIDITY_")
    ){
      self.sendSocketNotification(notification, payload)
    }
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
    if(notification === "TEMPERATURE_UPDATE"){
      if(
        (JSON.stringify(self.values) !== JSON.stringify(payload.values)) ||
        (!self.config.onlyUpdateIfValuesChanged)
      ){
        Log.info("Got new temperature values!")
        self.values = payload.values
        // var needToUpdateDom = true
        // for(let curSensorId = 0; curSensorId < self.config.sensors.length; curSensorId++){
        //   if((typeof self.values[curSensorId] !== "undefined") &&
        //      (typeof self.valuesObjs[curSensorId] !== "undefined")){
  
        //       if (typeof self.valuesObjs[curSensorId].temperature !== "undefined") {
        //         if (typeof self.values[curSensorId].temperature !== "undefined"){
        //           self.valuesObjs[curSensorId].temperature.innerHTML = self.values[curSensorId].temperature
        //         } else {
        //           self.valuesObjs[curSensorId].temperature.innerHTML = "na"
        //         }
        //       }
  
        //       if (typeof self.valuesObjs[curSensorId].humidity !== "undefined") {
        //         if (typeof self.values[curSensorId].humidity !== "undefined"){
        //           self.valuesObjs[curSensorId].humidity.innerHTML = self.values[curSensorId].humidity
        //         } else {
        //           self.valuesObjs[curSensorId].humidity.innerHTML = "na"
        //         }
        //       }
        //   } else {
        //     needToUpdateDom = true
        //     break
        //   }
        // }

        // if (needToUpdateDom){
          // self.updateDom(self.config.animationSpeed)
        // }
        self.updateDom(self.config.animationSpeed)
      } else {
        Log.info("Skipping temperature update because no values changed!")
      }
    }
  },
})
