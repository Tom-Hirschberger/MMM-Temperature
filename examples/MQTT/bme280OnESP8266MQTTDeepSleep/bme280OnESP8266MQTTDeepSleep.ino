#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
 
const char* SSID = "ENTER_WIFI_SSID_HERE";
const char* PSK = "ENTER_WIFI_PASSWORD_HERE";
const char* mqtt_broker = "ENTER_MQTT_ADDRESS_HERE";
const char* mqtt_user = "ENTER_MQTT_USER_HERE";
const char* mqtt_pass = "ENTER_MQTT_PASS_HERE";
const String client_name = "ENTER_MQTT_CLIENT_NAME_HERE";
const String topic_id = "ENTER_MQTT_TOPIC_HERE";
long interval = 1800; //how often should the values be send (seconds)
 
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
    client.setServer(mqtt_broker, 1883);
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
        if (!client.connect(client_name.c_str(), mqtt_user, mqtt_pass)) {
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
    
    client.publish((topic_id+"/temperature_c").c_str(), String(temperature).c_str());
    client.publish((topic_id+"/humidity").c_str(), String(humidity).c_str());
    delay(1000);
    startDeepSleep();
}

void startDeepSleep(){
  Serial.println("Going to deep sleep...");
  ESP.deepSleep(interval * 1000000);
  yield();
}
