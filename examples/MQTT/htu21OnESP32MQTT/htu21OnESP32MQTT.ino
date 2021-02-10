/*********
  Thanks to:
  Rui Santos
  Complete project details at https://randomnerdtutorials.com  

  Modified to use the HTU21 sensor
*********/
#include <WiFi.h>
#include <PubSubClient.h>
#include "Adafruit_HTU21DF.h"

const int updateInterval = 60000;

// Replace the next variables with your SSID/Password combination
const String ssid = "ENTER_WIFI_SSID_HERE";
const char* password = "ENTER_WIFI_PASSWORD_HERE";
const String topicId = "esp32_01";

// Add your MQTT Broker IP address:
const char* mqtt_server = "ENTER_MQTT_ADDRESS_HERE";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

Adafruit_HTU21DF htu = Adafruit_HTU21DF();
float temp = 0;
float rel_hum = 0;

void setup() {  
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  if(!htu.begin()){
    Serial.println("Couldn't find sensor!");
    while(1);
  }
}

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid.c_str(), password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
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

  // Feel free to add more if statements to control more GPIOs with MQTT

  // If a message is received on the topic esp32/output, you check if the message is either "on" or "off". 
  // Changes the output state according to the message
  if (String(topic) == topicId+"/output") {
    Serial.print("Changing output to ");
    if(messageTemp == "on"){
      Serial.println("on");
    }
    else if(messageTemp == "off"){
      Serial.println("off");
    }
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe((topicId+"/output").c_str());
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
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > updateInterval) {
    lastMsg = now;

    temp = htu.readTemperature();
    
    // Convert the value to a char array
    char tempString[8];
    dtostrf(temp, 1, 2, tempString);
    Serial.print("Temperature: ");
    Serial.println(tempString);
    client.publish((topicId+"/temperature").c_str(), tempString);

    rel_hum = htu.readHumidity();
    
    // Convert the value to a char array
    char humString[8];
    dtostrf(rel_hum, 1, 2, humString);
    Serial.print("Humidity: ");
    Serial.println(humString);
    client.publish((topicId+"/humidity").c_str(), humString);
  }
}
