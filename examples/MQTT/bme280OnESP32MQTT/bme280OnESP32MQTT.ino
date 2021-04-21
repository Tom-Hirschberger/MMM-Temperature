#include <WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
 
const char* SSID = "ENTER_WIFI_SSID_HERE";
const char* PSK = "ENTER_WIFI_PASSWORD_HERE";
const char* MQTT_BROKER = "ENTER_MQTT_SERVER_ADDRESS_HERE";
const char* MQTT_USER = "ENTER_MQTT_USERNAME_HERE";
const char* MQTT_PASS = "ENTER_MQTT_PASSWORD_HERE";
long interval = 10000;
 
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

Adafruit_BME280 bme;

float temperature, humidity;
 
void setup() {
    Serial.begin(115200);
    setup_wifi();
    client.setServer(MQTT_BROKER, 1883);
    reconnect();
    bme.begin(0x76);
}
 
void setup_wifi() {
    WiFi.disconnect(true, true);
    WiFi.mode(WIFI_STA);

    WiFi.begin(SSID, PSK);

    while (WiFi.status() == WL_DISCONNECTED) {
      delay(500);
    }

    if (WiFi.status() != WL_CONNECTED) {
      delay(10);
      Serial.println();
      Serial.print("Connecting to ");
      Serial.println(SSID);
   
      WiFi.begin(SSID, PSK);
   
      while (WiFi.status() != WL_CONNECTED) {
          delay(500);
          Serial.print(".");
      }
    }
 
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}
 
void reconnect() {
    while (!client.connected()) {
        Serial.println("Reconnecting...");
        if (!client.connect("ESP_TEMP", MQTT_USER, MQTT_PASS)) {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" retrying in 5 seconds");
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

    temperature = bme.readTemperature();
    humidity = bme.readHumidity();

    Serial.println("Publishing new values!");
    
    client.publish("esp_temp/temperature_c", String(temperature).c_str());
    client.publish("esp_temp/humidity", String(humidity).c_str());
    delay(interval);
}
