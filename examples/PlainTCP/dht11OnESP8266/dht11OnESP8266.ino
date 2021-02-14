#include <ESP8266WiFi.h>
#include <Wire.h>
#include "DHT.h"

const char* ssid     = "ENTER_WIFI_SSID_HERE";
const char* password = "ENTER_WIFI_PASSWORD_HERE";

//ENTER STATIC IP OF THE ESP32 BOARD HERE
IPAddress local_IP(192, 168, 0, 2); //ENTER_IP_HERE
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(192, 168, 0, 1);
IPAddress secondaryDNS(8, 8, 8, 8);

// DHT Sensor
uint8_t DHTPin = 5; //The GPIO number the DHT sensor is connected to

//Only use one of the lines below
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT21   // DHT 21 (AM2301)
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321

// Initialize DHT sensor.
DHT dht(DHTPin, DHTTYPE);
WiFiServer server(80);

float temperature, temperature_f, humidity;

void setup()
{
  Wire.begin();
  Serial.begin(115200);

  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("STA Failed to configure");
  }

  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("ESP Mac Address: ");
  Serial.println(WiFi.macAddress());
  Serial.print("Subnet Mask: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway IP: ");
  Serial.println(WiFi.gatewayIP());
  Serial.print("DNS: ");
  Serial.println(WiFi.dnsIP());

  pinMode(DHTPin, INPUT);

  dht.begin();

  server.begin();
}

void loop()
{
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();
  temperature_f = temperature * 1.8 + 32;
  
  WiFiClient client = server.available();
  if (client) {
    Serial.println("New Client."); 
    client.println("{");
    client.print("  \"temperature_c\": ");
    client.print(temperature);
    client.println(",");
    client.print("  \"temperature_f\": ");
    client.print(temperature_f);
    client.println(",");
    client.print("  \"humidity\": ");
    client.print(humidity);
    client.println(",");
    client.println("  \"error\": false");
    client.println("}");
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
  delay(100);
}
