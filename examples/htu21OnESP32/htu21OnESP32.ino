#include <WiFi.h>
#include <Wire.h>
#include "Adafruit_HTU21DF.h"

const char* ssid     = "##ADD_WIFI_SSID_HERE";
const char* password = "##ADD_WIFI_PASSWORD_HERE";

//ENTER STATIC IP OF THE ESP32 BOARD HERE
IPAddress local_IP(192, 168, 0, 2);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(192, 168, 0, 1);
IPAddress secondaryDNS(8, 8, 8, 8);

Adafruit_HTU21DF htu = Adafruit_HTU21DF();

WiFiServer server(80);

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

  if (!htu.begin()) {
    Serial.println("Couldn't find sensor!");
    while (1);
  }

  server.begin();
}

void loop()
{
  float temp = htu.readTemperature();
  float tempf = temp * 1.8 + 32;
  float rel_hum = htu.readHumidity();

  WiFiClient client = server.available();
  if (client) {
    Serial.println("New Client."); 
    client.println("{");
    client.print("  \"temperature_c\": ");
    client.print(temp);
    client.println(",");
    client.print("  \"temperature_f\": ");
    client.print(tempf);
    client.println(",");
    client.print("  \"humidity\": ");
    client.print(rel_hum);
    client.println(",");
    client.println("  \"error\": false");
    client.println("}");
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
  delay(100);
}
