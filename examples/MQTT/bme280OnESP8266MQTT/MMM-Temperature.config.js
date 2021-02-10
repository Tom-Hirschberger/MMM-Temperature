		{
			module: "MMM-Temperature",
			position: "top_center",
			config: {
				animationSpeed: 0,
				humidityText: "Feuchte:",
				temperatureText: "Temperatur:",
				updateInterval: 30,
				sensors: [
					{
						name: "ESP8266",
						notificationId: "ESP_TEMP"
					},
				]
			},
			classes: "pageFourSyno"
		},
