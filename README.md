# MMM-Temperature

This module reads temperature of different sensors (default HTU21D) with external scripts and displays the values.

As of version 0.0.10 of the module a wrapper script called `venvWrapper.py` is included which can be used to call the Python scripts within a virtual Python environment. All instructions in the readme are updated to use the wrapper as the virtual environment prevents system Python packages to get broken during the installation of dependencies.

:warning: **You may want to use [MMM-ValuesByNotification](https://github.com/Tom-Hirschberger/MMM-ValuesByNotification) instead of this module and [MMM-CommandToNotification](https://github.com/Tom-Hirschberger/MMM-CommandToNotification) to deliver the data of sensor.  
I will provide bugfixes for this module but there will be no new features!**

The new modules provide a lot of flexabilty but may be hard to configure in the first moment.

## Screenshots

![alt text](https://github.com/Tom-Hirschberger/MMM-Temperature/raw/master/examples/threeSensorsOneNameless.png "Three Sensors")

![alt text](https://github.com/Tom-Hirschberger/MMM-Temperature/raw/master/examples/oneNamelessSensor.png "One Sensor")

## Installation

### Module

```bash
    cd ~/MagicMirror/modules
    git clone https://github.com/Tom-Hirschberger/MMM-Temperature.git
    cd MMM-Temperature
    npm install
```

## Configuration

If you use an HTU21 attached to the Pi and want to use the wrapper script to call the htu21 script to read the values of this sensor you can use this config.

```json5
{
 module: "MMM-Temperature",
 position: "bottom_right",
 config: {
  sensors: [
    {
    }
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

### General

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| updateInterval | How often should the values be updated (in seconds) | Integer | 60 |
| useCelsius | If set to true the °C value is used °F otherwise | Boolean | true |
| temperatureText | The text displayed before the temperature value | String | "Temperature:" |
| humidityText | The text displayed before the humidity value | String | "Humidity:" |
| fractionCount | How many decimal places should be displayed after the "." | Integer | 1 |
| defaultScript | The script which is used to get the values of sensors with no own script option | String | "venvWrapper.py" |
| defaultArgs | The arguments of the default script | String | "--run ./htu21" |
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

### Sensors

| Option  | Description | Mandatory | Default |
| ------- | --- | --- | --- |
| name | The name of the sensor (if an name should be displayed) | false | |
| script | The script to call to get the values of the sensor. If not present the default script is used | false | |
| args | The arguments to pass to the script | false | |
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

## Included scripts

The module provides scripts to read data of different sensor types in default. Read the instructions of howto configure the scripts carefully.  

A later section contains instructions of howto read data over network attached sensors.

### bme280

Read the temperature, humidity and pressure of a BME280 sensor connected to the I2C bus and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

#### Requirements

* Make sure to enable the I2C bus of the system by running this commands in the shell and reboot the system:

```bash
if [ `grep -c "i2c-dev" /etc/modules` -lt 1 ]; then echo "i2c-dev" | sudo tee -a /etc/modules; echo "Added"; else echo "Skipped"; fi
```

```bash
sudo reboot
```

* Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

* Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

* Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --install-libs smbus
```

* Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --run ./bme280
```

#### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The I2C address of the sensor | String | 0x76 |

#### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "pressure": 512.0, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "pressure": 512.0,
    "temperature_f": 71.6,
    "error": false
}
```

#### Example config

```json5
{
   module: "MMM-Temperature",
   position: "bottom_right",
   config: {
    sensors: [
     {
        name: "Sensor One",
        script: "venvWrapper.py",
        args: "--run ./bme280 0x76",
     },
    ]
   },
},
```

This config results in:

* the BME280 sensor has the address 0x76
* the script will be called with the wrapper script

### dht11

Read the temperature and humidity of a DHT11 sensor connected to a configurable GPIO and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

#### Requirements

* Install the Python Virtual Environment and `libgpiod2` System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv libgpiod2
```

* Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

* Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --install-libs adafruit-circuitpython-dht
```

* Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --run ./dht11
```

#### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The number of the GPIO the sensor is connected to | Integer | 4 |

#### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "temperature_f": 71.6,
    "error": false
}
```

#### Example config

```json5
{
   module: "MMM-Temperature",
   position: "bottom_right",
   config: {
    sensors: [
     {
        name: "Sensor One",
        script: "venvWrapper.py",
        args: "--run ./dht11 4",
     },
    ]
   },
},
```

This config results in:

* the DHT11 sensor is connected to GPIO 4
* the script will be called with the wrapper

### dht22

Read the temperature and humidity of a DHT22 sensor connected to a configurable GPIO and return the values in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

#### Requirements

* Install the Python Virtual Environment and `libgpiod2` System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv libgpiod2
```

* Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

* Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --install-libs adafruit-circuitpython-dht
```

* Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --run ./dht22
```

#### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The number of the GPIO the sensor is connected to | Integer | 4 |

#### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "temperature_f": 71.6,
    "error": false
}
```

#### Example config

```json5
{
   module: "MMM-Temperature",
   position: "bottom_right",
   config: {
    sensors: [
     {
        name: "Sensor One",
        script: "venvWrapper.py",
        args: "--run ./dht22 4",
     },
    ]
   },
},
```

This config results in:

* the DHT22 sensor is connected to GPIO 4
* the script will be called by the wrapper

### htu21

Read the temperature and humidity of a HTU21 sensor connected to the I2C bus.

The output contains a error flag which will be set to "true" if the sensor could not be found!

#### Wiring

![alt text](https://github.com/Tom-Hirschberger/MMM-Temperature/raw/master/examples/htu21/htu21.png "Wiring HTU21")

#### Requirements

* Make sure to enable the I2C bus of the system by running this commands in the shell and reboot the system:

```bash
if [ `grep -c "i2c-dev" /etc/modules` -lt 1 ]; then echo "i2c-dev" | sudo tee -a /etc/modules; echo "Added"; else echo "Skipped"; fi
```

```bash
sudo reboot
```

* Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

* Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

* Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --install-libs adafruit-circuitpython-htu21d
```

* Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --run ./htu21
```

#### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "temperature_f": 71.6,
    "error": false
}
```

#### Example config

```json5
{
   module: "MMM-Temperature",
   position: "bottom_right",
   config: {
    sensors: [
     {
        name: "Sensor One",
        script: "venvWrapper.py",
        args: "--run ./htu21",
     },
    ]
   },
},
```

This config results in:

* the script will be called by the wrapper script

### sht31d

Read the temperature and humidity of a SHT31d sensor connected to the I2C bus.

The output contains a error flag which will be set to "true" if the sensor could not be found!

#### Requirements

* Make sure to enable the I2C bus of the system by running this commands in the shell and reboot the system:

```bash
if [ `grep -c "i2c-dev" /etc/modules` -lt 1 ]; then echo "i2c-dev" | sudo tee -a /etc/modules; echo "Added"; else echo "Skipped"; fi
```

```bash
sudo reboot
```

* Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

* Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

* Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --install-libs adafruit-circuitpython-sht31d
```

* Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --run ./sht31d
```

#### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "temperature_f": 71.6,
    "error": false
}
```

#### Example config

```json5
{
   module: "MMM-Temperature",
   position: "bottom_right",
   config: {
    sensors: [
     {
        name: "Sensor One",
        script: "venvWrapper.py",
        args: "--run ./sht31d",
     },
    ]
   },
},
```

This config results in:

* the script will be called by the wrapper

### temperature/shtc3

Read the temperature and humidity of a SHTC3 sensor connected to the I2C bus.

The output contains a error flag which will be set to "true" if the sensor could not be found!

#### Requirements

* Make sure to enable the I2C bus of the system by running this commands in the shell and reboot the system:

```bash
if [ `grep -c "i2c-dev" /etc/modules` -lt 1 ]; then echo "i2c-dev" | sudo tee -a /etc/modules; echo "Added"; else echo "Skipped"; fi
```

```bash
sudo reboot
```

* Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

* Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

* Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --install-libs smbus2
```

* Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --run ./shtc3
```

#### Example output

Real:

```json
{"temperature_c": 22.0, "humidity": 62.1, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "humidity": 62.1,
    "temperature_f": 71.6,
    "error": false
}
```

#### Example config

```json5
{
   module: "MMM-Temperature",
   position: "bottom_right",
   config: {
    sensors: [
     {
        name: "Sensor One",
        script: "venvWrapper.py",
        args: "--run ./shtc3",
     },
    ]
   },
},
```

This config results in:

* the script will be called by the wrapper script

### ds18b20

Read the temperature of a DS18B20 sensor connected to the one wire bus and return the value in a JSON object. The temperature will be returned in °C and Fahrenheit.

The output contains a error flag which will be set to "true" if the sensor could not be found!

#### Requirements

* Connect VCC pin to 3.3V
* Connect Ground pin to Ground
* Add an 4.7kOhm resister between data wire and VCC
* Add the the data wire to GPIO4 (which is the 1-wire bus pin) (more info at: https://www.circuitbasics.com/raspberry-pi-ds18b20-temperature-sensor-tutorial/)
* Add the following lines to `/etc/modules`
  * `w1_gpio`
  * `w1_therm`
* Add the following line to `/etc/boot/config.txt`
  * `dtoverlay=w1-gpio`
* Find the id of your sensor (starting with "28-") in `/sys/bus/w1/devices`: `ls /sys/bus/w1/devices/ | grep 28-`
* Check if you get values: `cat /sys/bus/w1/devices/YOUR_SENSOR_ID/w1_slave`

* Install the Python Virtual Environment System Package:

```bash
sudo apt -y update && sudo apt -y install python3-venv
```

* Use the wrapper script to create the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --verbose --venv-name py-venv --create
```

* Use the wrapper script to install the dependencies in the virtual environment:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --install-libs json
```

* Use the wrapper script to run the python script:

```bash
cd ~/MagicMirror/modules/MMM-Temperature/scripts
./venvWrapper.py --venv-name py-venv --run ./ds18b20 YOUR_SENSOR-id
```

#### Options

| Option  | Description | Type | Default |
| ------- | --- | --- | --- |
| First argument | The id of the sensor is | String | null |

#### Example output

Real:

```json
{"temperature_c": 22.0, "temperature_f": 71.6, "error": false}
```

Pritty Print:

```json
{
    "temperature_c": 22.0,
    "temperature_f": 71.6,
    "error": false
}
```

#### Example config

```json5
{
   module: "MMM-Temperature",
   position: "bottom_right",
   config: {
    sensors: [
     {
        name: "Sensor One",
        script: "venvWrapper.py",
        args: "--run ./ds18b20 28-XXXXXXXX",
        showHumidity: false
     },
    ]
   },
},
```

This config results in:

* the DS18b20 has the id "28-XXXXXXXX"
* the script will be called by the wrapper script
* as the sensor does not provide humidity values the elements will be not displayed

## Further examples

This section provides examples of howto read data of sensors connection not directly but via network.
A example is provided to connect a HTU21 sensor to an ESP32 microcontroller and read the data via wifi.
The config to get the data into the module is really simple because the on nearly every OS supported command "nc" is used to get the data over network.

### Plain TCP

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

### MQTT

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

File `/home/pi/MagicMirror/modules/MMM-MQTTbridge/dict/mqttDictionary.js`:

```js
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

## Developer Information

### Own scripts

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

### Own plain tcp values

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

### Own values via notification

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
