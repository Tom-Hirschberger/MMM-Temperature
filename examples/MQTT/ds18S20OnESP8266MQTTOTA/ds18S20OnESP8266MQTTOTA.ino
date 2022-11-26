//
/* ESPAsyncTCP: https://github.com/me-no-dev/ESPAsyncTCP
 * ESPAsyncWebServer: https://github.com/me-no-dev/ESPAsyncWebServer
 * AsyncElegantOTA: https://github.com/ayushsharma82/AsyncElegantOTA
 * PubSubClient: 2.8.0 
 * Onewire: 2.3.6
 * DallasTemperature by Miles Burton: 3.9.0
 */
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <AsyncElegantOTA.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "settings.h"

float temperature =  0.0;
float lastPublishedTemperature = -100.0;
long lastEnvironmentPublishTimestamp = 0;


AsyncWebServer server(80);

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

void publish_current_environment_values(){
  Serial.println("Publishing current environment values");
  if (client.connected()) {
    lastPublishedTemperature = temperature;
    lastEnvironmentPublishTimestamp = millis();
    client.publish((topic_id+"/environment/temperature").c_str(), String(temperature).c_str(), false);
  }
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  if (String(topic) == topic_id+"/get_environment"){
    publish_current_environment_values();
  }
}

void setup() {
    client.setBufferSize(512);
    Serial.begin(115200);
    setup_wifi();
    client.setServer(mqtt_broker, 1883);
    reconnect();
    client.setCallback(callback);

    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
      request->send(200, "text/plain", "Hi! I am "+host_name);
    });
  
    AsyncElegantOTA.begin(&server, ota_user, ota_pass);    // Start ElegantOTA
    server.begin();
    Serial.println("HTTP server started");

    sensors.begin();
}

void setup_wifi() {
    delay(10);
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(SSID);
 
    WiFi.begin(SSID, PSK);
 
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
 
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void reconnect() {
    // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(client_name.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println("connected");
      // Subscribe
      Serial.print("Subscribing with topic_id: ");
      Serial.println(topic_id);
      client.subscribe((topic_id+"/get_environment").c_str());
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
      setup_wifi();
  }
  
  if (!client.connected()) {
      reconnect();
  }
  client.loop();

  unsigned long curTime = millis();

  sensors.requestTemperatures(); 
  temperature = sensors.getTempCByIndex(0);
  
  if ( (curTime - lastEnvironmentPublishTimestamp) >= MAX_ENVIRONMENT_TIME_DIFF ){
    publish_current_environment_values();
  } else if (abs(temperature - lastPublishedTemperature) >= MAX_TEMP_DIFF){
      publish_current_environment_values();
  }

  delay(1000);
}
