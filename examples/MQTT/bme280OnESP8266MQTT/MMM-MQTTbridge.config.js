		{
			module: 'MMM-MQTTbridge',
			disabled: false,
			config: {
				mqttServer: "mqtt://:localhost:1883",
				mqttConfig:
				{
					listenMqtt: true,
					interval: 15000,
				},
				notiConfig:
				{
					listenNoti: false,
				},
				// set "NOTIFICATIONS -> MQTT" dictionary at /dict/notiDictionary.js
				// set "MQTT -> NOTIFICATIONS" dictionary at /dict/mqttDictionary.js
			},
		},
