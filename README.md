# MMM-Temperature ##
This module reads temperature of different sensors (default HTU21D) with external scripts and displays the values.

:warning: **You may want to use [MMM-ValuesByNotification](https://github.com/Tom-Hirschberger/MMM-ValuesByNotification) instead of this module and [MMM-CommandToNotification](https://github.com/Tom-Hirschberger/MMM-CommandToNotification) to deliver the data of sensor.  
I will provide bugfixes for this module but there will be no new features!**

The new modules provide a lot of flexabilty but may be hard to configure in the first moment.


## Screenshots ##
![alt text](https://github.com/Tom-Hirschberger/MMM-Temperature/raw/master/examples/threeSensorsOneNameless.png "Three Sensors")

![alt text](https://github.com/Tom-Hirschberger/MMM-Temperature/raw/master/examples/oneNamelessSensor.png "One Sensor")

## Installation ##
### Module ###
```
    cd ~/MagicMirror/modules
    git clone https://github.com/Tom-Hirschberger/MMM-Temperature.git
    cd MMM-Temperature
    npm install
```

### Optional HTU21 Library ###
If you want to use script provided to read data of a HTU21 sensor you need to install the adafruit library first.
```
    cd ~
    git clone https://github.com/mgaggero/Adafruit_Python_HTU21D.git
    cd Adafruit_Python_HTU21D
    sudo pip3 install .
    cd ..
    rm -rf Adafruit_Python_HTU21D
```

### Optional DHT11 and DHT22 library ###
```
    sudo pip3 install -g adafruit-circuitpython-dht
    sudo apt-get install libgpiod2
```

### Optional BME280 library ###
```
    sudo pip3 install -g smbus
```

### Optional HTU21 Sensor ###
![alt text](https://github.com/Tom-Hirschberger/MMM-Temperature/raw/master/examples/htu21/htu21.png "Wiring HTU21")

## Configuration ##
If you use an HTU21 attached to the Pi and want to use the htu21 script to read the values of this sensor you can use this config.

```json5
        {
            module: "MMM-Temperature",
	    position: "bottom_right",
	    config: {
		sensors: [
                    {}
                ]
            },
        },
```

This is a more complex version which uses two sensors with names. The script of the second sensor is a different one.

```json5
        {
            module: "MMM-Temperature",
            position: "bottom_right",
            config: {
                temperatureHigh: 30,
                temperatureLow: 10,
                humidityHigh: 60,
                humidityLow: 30,
			    sensors: [
                    {
                        name: "Sensor One",
                        temperatureHigh: 20,
                    },
                    {
                        name: "Sensor Two",
                        script: "my_script",
                        args: "-i 4"
                    }
                ]
            },
        },
```

### General ###
| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| updateInterval | How often should the values be updated (in seconds) | Integer | 60 |
| useCelsius | If set to true the °C value is used °F otherwise | Boolean | true |
| temperatureText | The text displayed before the temperature value | String | "Temperature:" |
| humidityText | The text displayed before the humidity value | String | "Humidity:" |
| fractionCount | How many decimal places should be displayed after the "." | Integer | 1 |
| defaultScript | The script which is used to get the values of sensors with no own script option | String | "htu21" |
| defaultArgs | The arguments of the default script | String | "" |
| temperatureHigh | Specify a value of which temperature will be marked as high (in default displayed as red) | Float | 1000 |
| temperatureLow | Specify a value of which temperature will be marked as low (in default displayed as red) | Float | -1000 |
| humidityHigh | Specify a value of which humidity will be marked as high (in default displayed as red) | Float | 101 |
| humidityLow | Specify a value of which humidity will be marked as low (in default displayed as red) | Float | -1 |
| windAvgHigh | Specify a value of which the average wind speed will be marked as high (in default displayed as red) | Float | 60 |
| windAvgLow | Specify a value of which the average wind speed will be marked as low (in default displayed as red) | Float | -1 |
| windMaxHigh | Specify a value of which maximum wind speed will be marked as high (in default displayed as red) | Float | 60 |
| windMaxLow | Specify a value of which maximum wind speed will be marked as low (in default displayed as red) | Float | -1 |
| uvHigh | Specify a value of which the uv value will be marked as high (in default displayed as red) | Float | 200 |
| uvLow | Specify a value of which uv value will be marked as low (in default displayed as red) | Float | -1 |
| rainHigh | Specify a value of which rain value will be marked as high (in default displayed as red) | Float | 300 |
| rainLow | Specify a value of which rain value will be marked as low (in default displayed as red) | Float | -1 |
| lightHigh | Specify a value of which light value will be marked as high (in default displayed as red) | Float | 80000 |
| lightLow | Specify a value of which light value will be marked as low (in default displayed as red) | Float | -1 |
| showTemperature | Controls if the temperature will be displayed for the sensors (can be overriden at each sensor) | Boolean | true |
| showHumidity | Controls if the humidity will be displayed for the sensors (can be overriden at each sensor) | Boolean | true |
| showWind | Controls if the wind values will be displayed for the sensors (can be overriden at each sensor) | Boolean | true |
| showRain | Controls if the rain value will be displayed for the sensors (can be overriden at each sensor) | Boolean | true |
| showUv | Controls if the UV value will be displayed for the sensors (can be overriden at each sensor) | Boolean | true |
| showLight | Controls if the light value will be displayed for the sensors (can be overriden at each sensor) | Boolean | true |
| sensors | The array containing the configuration of the different sensors | Array | [] |

### Sensors ###
| Option  | Description | Mandatory |
| ------- | --- | --- |
| name | The name of the sensor (if an name should be displayed) | false |
| script | The script to call to get the values of the sensor. If not present the default script is used | false |
| args | The arguments to pass to the script | false |
| notificationId | If no script should be called but the values get send via notification (i.e. because of use of the MQTTBridge module) specify the identifier at the end of the notifications here (i.e. if the notification "TEMPERATURE_C_ESP_DEV" is send the notificationId is "ESP_DEV"). | false |
| temperatureHigh | Specify a value of which temperature will be marked as high (in default displayed as red) | Float | 1000 |
| temperatureLow | Specify a value of which temperature will be marked as low (in default displayed as red) | Float | -1000 |
| showTemperature | Controls if the temperature will be displayed for THIS sensor | Boolean | true |
| showHumidity | Controls if the humidity will be displayed for THIS sensor | Boolean | true |
| showWind | Controls if the wind values will be displayed for THIS sensor | Boolean | true |
| showRain | Controls if the rain value will be displayed for THIS sensor | Boolean | true |
| showUv | Controls if the UV value will be displayed for THIS sensor | Boolean | true |
| showLight | Controls if the light value will be displayed for THIS sensor | Boolean | true |
| humidityHigh | Specify a value of which humidity will be marked as high (in default displayed as red) | Float | 101 |
| humidityLow | Specify a value of which humidity will be marked as low (in default displayed as red) | Float | -1 |
| windAvgHigh | Specify a value of which the average wind speed will be marked as high (in default displayed as red) | Float | 60 |
| windAvgLow | Specify a value of which the average wind speed will be marked as low (in default displayed as red) | Float | -1 |
| windMaxHigh | Specify a value of which maximum wind speed will be marked as high (in default displayed as red) | Float | 60 |
| windMaxLow | Specify a value of which maximum wind speed will be marked as low (in default displayed as red) | Float | -1 |
| uvHigh | Specify a value of which the uv value will be marked as high (in default displayed as red) | Float | 200 |
| uvLow | Specify a value of which uv value will be marked as low (in default displayed as red) | Float | -1 |
| rainHigh | Specify a value of which rain value will be marked as high (in default displayed as red) | Float | 300 |
| rainLow | Specify a value of which rain value will be marked as low (in default displayed as red) | Float | -1 |
| lightHigh | Specify a value of which light value will be marked as high (in default displayed as red) | Float | 80000 |
| lightLow | Specify a value of which light value will be marked as low (in default displayed as red) | Float | -1 |
| useValuesCnt | Normally a sensors values get updated each time the updateInterval is reached. If you want to re-use the values a couple of times (i.e. if the sensor is connected via MQTT and does not send new values that often) you can specify a number of how often the values should be used. | Integer | undefined |
  
**The temperature and humidity high and low values and the showTemperature and showHumdity values configured at sensors will override the global configured ones!**

## Examples ##
### HTU21 ###
As described above the module has included a script to read the data of a HTU21 sensor attached to the Raspberry.
Additionally an example is provided to connect a HTU21 sensor to an ESP32 microcontroller and read the data via wifi.
The config to get the data into the module is really simple because the on nearly every OS supported command "nc" is used to get the data over network.
```json5

		{
			module: "MMM-Temperature",
			position: "bottom_right",
			config: {
				sensors: [
					{
					    name: "Sensor One"
					},
				]
			},
		},

```

### DHT11 ###
```json5

		{
			module: "MMM-Temperature",
			position: "bottom_right",
			config: {
				sensors: [
					{
					    name: "Sensor One",
					    script: "dht11",
					    args: "4" //Change this to the GPIO number the sensor is connected to
					},
				]
			},
		},

```

### DHT22 ###
```json5

		{
			module: "MMM-Temperature",
			position: "bottom_right",
			config: {
				sensors: [
					{
					    name: "Sensor One",
					    script: "dht22",
					    args: "4" //Change this to the GPIO number the sensor is connected to
					},
				]
			},
		},

```

### BME280 ###
If you are unsure which I2C address is used by your sensor you can either run 
```
sudo i2cdetect -y 1
```
or you can try some well known ones (0x76, 0x77).
If your BME280 uses I2C address 0x76 (as most of my sensors do) you can run the script without any options:
```json5

		{
			module: "MMM-Temperature",
			position: "bottom_right",
			config: {
				sensors: [
					{
					    name: "Sensor One",
					    script: "bme280",
					},
				]
			},
		},

```

If your sensor uses an different address you can specify it as an commandline option (i.e. 0x77):
```json5

		{
			module: "MMM-Temperature",
			position: "bottom_right",
			config: {
				sensors: [
					{
					    name: "Sensor One",
					    script: "bme280",
						args: "0x77",
					},
				]
			},
		},

```

### DS18B20 ###
```json5

		{
			module: "MMM-Temperature",
			position: "bottom_right",
			config: {
				sensors: [
					{
					    name: "Sensor One",
					    script: "ds18b20",
					    args: "28-XXXXXXXX", //Get the id of your sensor by running "ls /sys/bus/w1/devices/ | grep 28-"
					    showHumidity: false //As the sensor only provides temperature and no humidity we hide the humdidity section
                    			},
				]
			},
		},

```

### Plain TCP ###
See the [plain TCP example directory](https://github.com/Tom-Hirschberger/MMM-Temperature/raw/master/examples/PlainTCP) for some examples of howto connect an HTU21 sensor to an ESP32 or ESP8266 board.
```json5

		{
			module: "MMM-Temperature",
			position: "bottom_right",
			config: {
				sensors: [
					{
					    name: "Wifi",
					    script: "/bin/nc",
					    args: "-w3 192.168.0.2 80" //Change the IP to the one of the ESP board your sensor is connected to
                    			},
				]
			},
		},

```

### MQTT ###
See the [MQTT example directory](https://github.com/Tom-Hirschberger/MMM-Temperature/raw/master/examples/MQTT) for some examples of howto connect an HTU21 sensor to an ESP32 or ESP8266 board and send the values to your MQTT Server (i.e mosquitto). You will need to have the [MMM-MQTTbridge](https://github.com/sergge1/MMM-MQTTbridge) module of Sergge1 up and running to use this configuration.
```json5

		{
			module: "MMM-Temperature",
			position: "bottom_right",
			config: {
				sensors: [
					{
					    name: "Wifi",
					    notificationId: "ESP_TEMP",
                    			},
				]
			},
		},

		{
			module: 'MMM-MQTTbridge',
			config: {
				mqttServer: "mqtt://:@localhost:1883",
				mqttConfig:
				{
					listenMqtt: true,
				},
			},
		},

```

File "/home/pi/MagicMirror/modules/MMM-MQTTbridge/dict/mqttDictionary.js":
```
var mqttHook = [
    {
      mqttTopic: "esp_temp/temperature_c",
      mqttPayload: [
        {
          payloadValue: "",
          mqttNotiCmd: ["ESP_TEMP_Temp"],
          mqttPayload: ""
        },
      ],
    },
    {
      mqttTopic: "esp_temp/humidity",
      mqttPayload: [
        {
          payloadValue: "",
          mqttNotiCmd: ["ESP_TEMP_Humidity"],
          mqttPayload: ""
        },
      ],
    },
  ];
var mqttNotiCommands = [
    {
      commandId: "ESP_TEMP_Temp",
      notiID: "TEMPERATURE_C_ESP_TEMP",
    },
    {
      commandId: "ESP_TEMP_Humidity",
      notiID: "HUMIDITY_ESP_TEMP",
    },
  ];

  module.exports = { mqttHook,  mqttNotiCommands};
```


## Developer Information ##
### Own scripts ###
If you want to write an own script to read values of an sensor provide the following output on console to get the module to read the values:
```json5
{
   "humidity": 32.61236572265625,
   "temperature_c": 25.50150878906249, //Temperature in °C
   "temperature_f": 77.9027158203125, //Temperature in °F
   "error": false
}
```
If error is set to true all other values will be ignored.

### Own plain tcp values ###
If you want to provide your values via plain TCP simply react to connections at a varius port and provide a string in the form:
```json5
{
   "humidity": 32.61236572265625,
   "temperature_c": 25.50150878906249, //Temperature in °C
   "temperature_f": 77.9027158203125, //Temperature in °F
   "error": false
}
```
If error is set to true all other values will be ignored.

### Own values via notification ###
You can provide your values via notification. Make sure to send new values more often than the refresh interval configured for the module. If the module refreshes but no new values had been provided in the time between "na" will be displayed! Your notifications need to be suffixed with an unique id (identical to "notificationId" value in the configuration).
| Notification | Description | Payload |
| ------------ | ----------- | ------- |
| TEMPERATURE_C_SENSOR_ID | Updates the temperature in degree celcius value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| TEMPERATURE_F_SENSOR_ID | Updates the temperature in degree fahrenheit value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| HUMIDITY_SENSOR_ID | Updates the humidity value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| WIND_SPEED_MAX_SENSOR_ID | Updates the maximum wind speed value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| WIND_SPEED_AVG_SENSOR_ID | Updates the average wind speed value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| WIND_DIRECTION_SENSOR_ID | Updates the wind direction value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| RAIN_SENSOR_ID | Updates the rain value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| UV_SENSOR_ID | Updates the UV value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| LIGHT_SENSOR_ID | Updates the light value of the sensor with id "SENSOR_ID". | The current value as floating point or integer number |
| TEMPERATURE_VALUES_SENSOR_ID | Send the data as json with the keys "temperature_c", "temperature_f" and "humidity". All values (which are present in the json) of the sensor with id "SENSOR_ID" will be updated. | A json object |
