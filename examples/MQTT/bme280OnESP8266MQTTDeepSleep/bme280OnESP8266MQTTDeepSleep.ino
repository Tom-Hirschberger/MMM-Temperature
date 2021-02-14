#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
 
const char* SSID = "ENTER_WIFI_SSID_HERE";
const char* PSK = "ENTER_WIFI_PASSWORD_HERE";
const char* MQTT_BROKER = "ENTER_MQTT_BROKER_IP_OR_HOSTNAME_HERE";
const char* MQTT_USER = "ENTER_MQTT_USERNAME_HERE";
const char* MQTT_PASS = "ENTER_MQTT_PASSWORD_HERE";
long interval = 600; //how often should the values be send (seconds)
 
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

    bme.begin(0x76);
}
 
void reconnect() {
    while (!client.connected()) {
        Serial.print("Reconnecting...");
        if (!client.connect("ESP_DEV", MQTT_USER, MQTT_PASS)) {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" retrying in 5 seconds");
            delay(5000);
        }
    }
}
void loop() {
 
    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    temperature = bme.readTemperature();
    humidity = bme.readHumidity();

    Serial.println("Publishing new values!");
    
    client.publish("esp_dev/temperature_c", String(temperature).c_str());
    client.publish("esp_dev/humidity", String(humidity).c_str());
    delay(1000);
    startDeepSleep();
}

void startDeepSleep(){
  Serial.println("Going to deep sleep...");
  ESP.deepSleep(interval * 1000000);
  yield();
}
