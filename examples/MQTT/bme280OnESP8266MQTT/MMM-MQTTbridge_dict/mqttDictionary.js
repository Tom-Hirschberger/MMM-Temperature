
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
