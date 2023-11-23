/* global Module

/* MagicMirror²
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
    windAvgText: "Wind Avg.:",
    windMaxText: "Wind Max.:",
    windDirText: "Wind Dir.:",
    uvText: "UV: ",
    rainText: "Rain: ",
    lightText: "Light: ",
    showHumidiy: true,
    showTemperature: true,
    showWind: false,
    showRain: false,
    showUv: false,
    showLight: false,
    sensors: [],
    defaultScript: "htu21",
    defaultArgs: "",
    fractionCount: 1,
    onlyUpdateIfValuesChanged: true,
    temperatureLow: -1000,
    temperatureHigh: 1000,
    humidityLow: -1,
    humidityHigh: 101,
    windAvgLow: -1,
    windAvgHigh: 60,
    windMaxLow: -1,
    windMaxHigh: 60,
    uvLow: -1,
    uvHigh: 200,
    rainLow: -1,
    rainHigh: 300,
    lightLow: -1,
    lightHigh: 80000
  },

  getStyles: function() {
    return ['temperature.css']
  },

  // getScripts: function () {
	// 	return [this.file('node_modules/json5/dist/index.min.js')];
	// },

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

        valueToCheck = self.config.showWind
        if(typeof self.config.sensors[curSensorId].showWind !== "undefined"){
          valueToCheck = self.config.sensors[curSensorId].showWind
        }

        if(valueToCheck){
          //WindSpeed Average
          var windAvgWrapper = document.createElement("div")
            windAvgWrapper.className = "wind-avg"
            var windAvgInnerWrapper = document.createElement("div")
            windAvgInnerWrapper.className = "windAvgWrapper"

            var windAvgDescription = document.createElement("div")
              windAvgDescription.className = "description"
              windAvgDescription.innerHTML = self.config.windAvgText
              windAvgInnerWrapper.appendChild(windAvgDescription)


            var windAvgValueWrapper = document.createElement("div")
              windAvgValueWrapper.className = "valueWrapper"
              var windAvgValue = document.createElement("div")
                curClassName = "value"
                self.valuesObjs[curSensorId].windAvg = windAvgValue

                var windAvgUnit = document.createElement("div")
                  windAvgUnit.className = "unit"
                  windAvgUnit.innerHTML = "m/s"

                if(
                  (typeof self.values[curSensorId] !== "undefined") &&
                  (typeof self.values[curSensorId].wind_avg_m_s !== "undefined")){
          
                  windAvgValue.innerHTML = self.values[curSensorId].wind_avg_m_s
                  curClassName += " valid"

                  valueToCheck = self.config.windAvgLow
                  if(typeof self.config.sensors[curSensorId].windAvgLow !== "undefined"){
                    valueToCheck = self.config.sensors[curSensorId].windAvgLow
                  }

                  if (self.values[curSensorId].wind_avg_m_s <= valueToCheck) {
                    curClassName += " low"
                    windAvgWrapper.className += " low"
                    windAvgDescription.className += " low"
                    windAvgValueWrapper.className += " low"
                    windAvgUnit.className += " low"
                    lowValue = true
                  }

                  valueToCheck = self.config.windAvgHigh
                  if(typeof self.config.sensors[curSensorId].windAvgHigh !== "undefined"){
                    valueToCheck = self.config.sensors[curSensorId].windAvgHigh
                  }

                  if (self.values[curSensorId].wind_avg_m_s >= valueToCheck) {
                    curClassName += " high"
                    windAvgWrapper.className += " high"
                    windAvgDescription.className += " high"
                    windAvgValueWrapper.className += " high"
                    windAvgUnit.className += " high"
                    highValue = true
                  }
                } else {
                  windAvgValue.innerHTML = "na"
                  curClassName += " na"
                  windAvgWrapper.className += " na"
                  windAvgDescription.className += " na"
                  windAvgValueWrapper.className += " na"
                  windAvgUnit.className += " na"
                  naValue = true
                }
                
                windAvgValue.className = curClassName

                windAvgValueWrapper.appendChild(windAvgValue)
                windAvgValueWrapper.appendChild(windAvgUnit)
                windAvgInnerWrapper.appendChild(windAvgValueWrapper)
              windAvgWrapper.appendChild(windAvgInnerWrapper)
            sensorInnerWrapper.appendChild(windAvgWrapper)

            //WindSpeed Maximum
            var windMaxWrapper = document.createElement("div")
            windMaxWrapper.className = "wind-max"
            var windMaxInnerWrapper = document.createElement("div")
            windMaxInnerWrapper.className = "windMaxWrapper"

            var windMaxDescription = document.createElement("div")
              windMaxDescription.className = "description"
              windMaxDescription.innerHTML = self.config.windMaxText
              windMaxInnerWrapper.appendChild(windMaxDescription)


            var windMaxValueWrapper = document.createElement("div")
              windMaxValueWrapper.className = "valueWrapper"
              var windMaxValue = document.createElement("div")
                curClassName = "value"
                self.valuesObjs[curSensorId].windMax = windMaxValue

                var windMaxUnit = document.createElement("div")
                  windMaxUnit.className = "unit"
                  windMaxUnit.innerHTML = "m/s"

                if(
                  (typeof self.values[curSensorId] !== "undefined") &&
                  (typeof self.values[curSensorId].wind_max_m_s !== "undefined")){
          
                  windMaxValue.innerHTML = self.values[curSensorId].wind_max_m_s
                  curClassName += " valid"

                  valueToCheck = self.config.windMaxLow
                  if(typeof self.config.sensors[curSensorId].windMaxLow !== "undefined"){
                    valueToCheck = self.config.sensors[curSensorId].windMaxLow
                  }

                  if (self.values[curSensorId].wind_max_m_s <= valueToCheck) {
                    curClassName += " low"
                    windMaxWrapper.className += " low"
                    windMaxDescription.className += " low"
                    windMaxValueWrapper.className += " low"
                    windMaxUnit.className += " low"
                    lowValue = true
                  }

                  valueToCheck = self.config.windMaxHigh
                  if(typeof self.config.sensors[curSensorId].windMaxHigh !== "undefined"){
                    valueToCheck = self.config.sensors[curSensorId].windMaxHigh
                  }

                  if (self.values[curSensorId].wind_max_m_s >= valueToCheck) {
                    curClassName += " high"
                    windMaxWrapper.className += " high"
                    windMaxDescription.className += " high"
                    windMaxValueWrapper.className += " high"
                    windMaxUnit.className += " high"
                    highValue = true
                  }
                } else {
                  windMaxValue.innerHTML = "na"
                  curClassName += " na"
                  windMaxWrapper.className += " na"
                  windMaxDescription.className += " na"
                  windMaxValueWrapper.className += " na"
                  windMaxUnit.className += " na"
                  naValue = true
                }
                
                windMaxValue.className = curClassName

                windMaxValueWrapper.appendChild(windMaxValue)
                windMaxValueWrapper.appendChild(windMaxUnit)
                windMaxInnerWrapper.appendChild(windMaxValueWrapper)
              windMaxWrapper.appendChild(windMaxInnerWrapper)
            sensorInnerWrapper.appendChild(windMaxWrapper)

            //WindDirection
            var windDirWrapper = document.createElement("div")
            windDirWrapper.className = "wind-dir"
            var windDirInnerWrapper = document.createElement("div")
            windDirInnerWrapper.className = "windDirWrapper"

            var windDirDescription = document.createElement("div")
              windDirDescription.className = "description"
              windDirDescription.innerHTML = self.config.windDirText
              windDirInnerWrapper.appendChild(windDirDescription)


            var windDirValueWrapper = document.createElement("div")
              windDirValueWrapper.className = "valueWrapper"
              var windDirValue = document.createElement("div")
                curClassName = "value"
                self.valuesObjs[curSensorId].windDir = windDirValue

                var windDirUnit = document.createElement("div")
                  windDirUnit.className = "unit"
                  windDirUnit.innerHTML = "&nbsp;&nbsp;°"

                if(
                  (typeof self.values[curSensorId] !== "undefined") &&
                  (typeof self.values[curSensorId].wind_dir_deg !== "undefined")){
          
                  windDirValue.innerHTML = self.values[curSensorId].wind_dir_deg
                  curClassName += " valid"
                } else {
                  windDirValue.innerHTML = "na"
                  curClassName += " na"
                  windDirWrapper.className += " na"
                  windDirDescription.className += " na"
                  windDirValueWrapper.className += " na"
                  windDirUnit.className += " na"
                  naValue = true
                }
                
                windDirValue.className = curClassName

                windDirValueWrapper.appendChild(windDirValue)
                windDirValueWrapper.appendChild(windDirUnit)
                windDirInnerWrapper.appendChild(windDirValueWrapper)
              windDirWrapper.appendChild(windDirInnerWrapper)
            sensorInnerWrapper.appendChild(windDirWrapper)
          }

          //Rain
          valueToCheck = self.config.showRain
          if(typeof self.config.sensors[curSensorId].showRain !== "undefined"){
            valueToCheck = self.config.sensors[curSensorId].showRain
          }

          if(valueToCheck){
            var rainWrapper = document.createElement("div")
              rainWrapper.className = "rain"
              var rainInnerWrapper = document.createElement("div")
                rainInnerWrapper.className = "rainWrapper"

                var rainDescription = document.createElement("div")
                  rainDescription.className = "description"
                  rainDescription.innerHTML = self.config.rainText
                  rainInnerWrapper.appendChild(rainDescription)


                var rainValueWrapper = document.createElement("div")
                  rainValueWrapper.className = "valueWrapper"
                  var rainValue = document.createElement("div")
                    curClassName = "value"
                    self.valuesObjs[curSensorId].rain = rainValue

                    var rainUnit = document.createElement("div")
                      rainUnit.className = "unit"
                      rainUnit.innerHTML = "&nbsp;&nbsp;"

                    if(
                      (typeof self.values[curSensorId] !== "undefined") &&
                      (typeof self.values[curSensorId].rain_mm !== "undefined")){
                      rainValue.innerHTML = self.values[curSensorId].rain_mm
                      curClassName += " valid"

                      valueToCheck = self.config.rainLow
                      if(typeof self.config.sensors[curSensorId].rainLow !== "undefined"){
                        valueToCheck = self.config.sensors[curSensorId].rainLow
                      }

                      if (self.values[curSensorId].rain_mm <= valueToCheck) {
                        curClassName += " low"
                        rainWrapper.className += " low"
                        rainDescription.className += " low"
                        rainValueWrapper.className += " low"
                        rainUnit.className += " low"
                        lowValue = true
                      }

                      valueToCheck = self.config.rainHigh
                      if(typeof self.config.sensors[curSensorId].rainHigh !== "undefined"){
                        valueToCheck = self.config.sensors[curSensorId].rainHigh
                      }

                      if (self.values[curSensorId].rain_mm >= valueToCheck) {
                        curClassName += " high"
                        rainWrapper.className += " high"
                        rainDescription.className += " high"
                        rainValueWrapper.className += " high"
                        rainUnit.className += " high"
                        highValue = true
                      }
                    } else {
                      rainValue.innerHTML = "na"
                      curClassName += " na"
                      rainWrapper.className += " na"
                      rainDescription.className += " na"
                      rainValueWrapper.className += " na"
                      rainUnit.className += " na"
                      naValue = true
                    }
                    rainValue.className = curClassName

                  rainValueWrapper.appendChild(rainValue)
                  rainValueWrapper.appendChild(rainUnit)
                  rainInnerWrapper.appendChild(rainValueWrapper)
                rainWrapper.appendChild(rainInnerWrapper)
          sensorInnerWrapper.appendChild(rainWrapper)
        }

        //Uv Light
        valueToCheck = self.config.showUv
          if(typeof self.config.sensors[curSensorId].showUv !== "undefined"){
            valueToCheck = self.config.sensors[curSensorId].showUv
          }

          if(valueToCheck){
            var uVWrapper = document.createElement("div")
              uVWrapper.className = "uv"
              var uVInnerWrapper = document.createElement("div")
                uVInnerWrapper.className = "uVWrapper"

                var uVDescription = document.createElement("div")
                  uVDescription.className = "description"
                  uVDescription.innerHTML = self.config.uvText
                  uVInnerWrapper.appendChild(uVDescription)


                var uVValueWrapper = document.createElement("div")
                  uVValueWrapper.className = "valueWrapper"
                  var uVValue = document.createElement("div")
                    curClassName = "value"
                    self.valuesObjs[curSensorId].uv = uVValue

                    var uVUnit = document.createElement("div")
                      uVUnit.className = "unit"
                      uVUnit.innerHTML = "&nbsp;&nbsp;"

                    if(
                      (typeof self.values[curSensorId] !== "undefined") &&
                      (typeof self.values[curSensorId].uv !== "undefined")){
                      uVValue.innerHTML = self.values[curSensorId].uv
                      curClassName += " valid"

                      valueToCheck = self.config.uvLow
                      if(typeof self.config.sensors[curSensorId].uvLow !== "undefined"){
                        valueToCheck = self.config.sensors[curSensorId].uvLow
                      }

                      if (self.values[curSensorId].uv <= valueToCheck) {
                        curClassName += " low"
                        uVWrapper.className += " low"
                        uVDescription.className += " low"
                        uVValueWrapper.className += " low"
                        uVUnit.className += " low"
                        lowValue = true
                      }

                      valueToCheck = self.config.uvHigh
                      if(typeof self.config.sensors[curSensorId].uvHigh !== "undefined"){
                        valueToCheck = self.config.sensors[curSensorId].uvHigh
                      }

                      if (self.values[curSensorId].uv >= valueToCheck) {
                        curClassName += " high"
                        uVWrapper.className += " high"
                        uVDescription.className += " high"
                        uVValueWrapper.className += " high"
                        uVUnit.className += " high"
                        highValue = true
                      }
                    } else {
                      uVValue.innerHTML = "na"
                      curClassName += " na"
                      uVWrapper.className += " na"
                      uVDescription.className += " na"
                      uVValueWrapper.className += " na"
                      uVUnit.className += " na"
                      naValue = true
                    }
                    uVValue.className = curClassName

                  uVValueWrapper.appendChild(uVValue)
                  uVValueWrapper.appendChild(uVUnit)
                  uVInnerWrapper.appendChild(uVValueWrapper)
                uVWrapper.appendChild(uVInnerWrapper)
          sensorInnerWrapper.appendChild(uVWrapper)
        }

        //Light
        valueToCheck = self.config.showLight
          if(typeof self.config.sensors[curSensorId].showLight !== "undefined"){
            valueToCheck = self.config.sensors[curSensorId].showLight
          }

          if(valueToCheck){
            var lightWrapper = document.createElement("div")
              lightWrapper.className = "light"
              var lightInnerWrapper = document.createElement("div")
                lightInnerWrapper.className = "lightWrapper"

                var lightDescription = document.createElement("div")
                  lightDescription.className = "description"
                  lightDescription.innerHTML = self.config.lightText
                  lightInnerWrapper.appendChild(lightDescription)


                var lightValueWrapper = document.createElement("div")
                  lightValueWrapper.className = "valueWrapper"
                  var lightValue = document.createElement("div")
                    curClassName = "value"
                    self.valuesObjs[curSensorId].light = lightValue

                    var lightUnit = document.createElement("div")
                      lightUnit.className = "unit"
                      lightUnit.innerHTML = "lx"

                    if(
                      (typeof self.values[curSensorId] !== "undefined") &&
                      (typeof self.values[curSensorId].light_lux !== "undefined")){
                      lightValue.innerHTML = self.values[curSensorId].light_lux
                      curClassName += " valid"

                      valueToCheck = self.config.lightLow
                      if(typeof self.config.sensors[curSensorId].lightLow !== "undefined"){
                        valueToCheck = self.config.sensors[curSensorId].lightLow
                      }

                      if (self.values[curSensorId].light_lux <= valueToCheck) {
                        curClassName += " low"
                        lightWrapper.className += " low"
                        lightDescription.className += " low"
                        lightValueWrapper.className += " low"
                        lightUnit.className += " low"
                        lowValue = true
                      }

                      valueToCheck = self.config.lightHigh
                      if(typeof self.config.sensors[curSensorId].lightHigh !== "undefined"){
                        valueToCheck = self.config.sensors[curSensorId].lightHigh
                      }

                      if (self.values[curSensorId].light_lux >= valueToCheck) {
                        curClassName += " high"
                        lightWrapper.className += " high"
                        lightDescription.className += " high"
                        lightValueWrapper.className += " high"
                        lightUnit.className += " high"
                        highValue = true
                      }
                    } else {
                      lightValue.innerHTML = "na"
                      curClassName += " na"
                      lightWrapper.className += " na"
                      lightDescription.className += " na"
                      lightValueWrapper.className += " na"
                      lightUnit.className += " na"
                      naValue = true
                    }
                    lightValue.className = curClassName

                  lightValueWrapper.appendChild(lightValue)
                  lightValueWrapper.appendChild(lightUnit)
                  lightInnerWrapper.appendChild(lightValueWrapper)
                lightWrapper.appendChild(lightInnerWrapper)
          sensorInnerWrapper.appendChild(lightWrapper)
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
        notification.startsWith("TEMPERATURE_VALUES_") ||
        notification.startsWith("HUMIDITY_") ||
        notification.startsWith("WIND_SPEED_MAX_") ||
        notification.startsWith("WIND_SPEED_AVG_") ||
        notification.startsWith("WIND_DIRECTION_") ||
        notification.startsWith("RAIN_") ||
        notification.startsWith("UV_") ||
        notification.startsWith("LIGHT_")
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
