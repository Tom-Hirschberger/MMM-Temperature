#include <WiFi.h>
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
    client.setServer(mqtt_broker, 1883);
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
    // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(client_name.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println("connected");
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

    temperature = bme.readTemperature();
    humidity = bme.readHumidity();

    Serial.println("Publishing new values!");
    
    client.publish((topic_id+"/temperature_c").c_str(), String(temperature).c_str());
    client.publish((topic_id+"/humidity").c_str(), String(humidity).c_str());
    delay(interval);
}
