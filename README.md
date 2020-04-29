# MMM-Temperature ##
This module reads temperature of different sensors (default HTU21D) with external scripts and displays the values.

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
			    sensors: [
                    {
                        name: "Sensor One"
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
| humidityText | The text displayed before the humidity value | String | "Huidity:" |
| fractionCount | How many decimal places should be displayed after the "." | Integer | 1 |
| defaultScript | The script which is used to get the values of sensors with no own script option | String | "htu21" |
| defaultArgs | The arguments of the default script | String | "" |
| sensors | The array containing the configuration of the different sensors | Array | [] |

### Sensors ###
| Option  | Description | Mandatory |
| ------- | --- | --- |
| name | The name of the sensor (if an name should be displayed) | false |
| script | The script to call to get the values of the sensor. If not present the default script is used | false |
| args | The arguments to pass to the script | false |

## Beispiele ##
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
					{
						name: "Wifi",
						script: "/bin/nc",
						args: "-w3 192.168.0.2 80"
					}
				]
			},
		},

```


## Developer Information ##
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
