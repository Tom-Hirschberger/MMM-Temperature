#include <heltec.h>
#include <WiFi.h>
#include "Adafruit_HTU21DF.h"
//MAKE SURE TO CONNECT THE SENSOR TO PINS 4 AND 15
//THIS IS BECAUSE OF THE OLED

const String ssid     = "ENTER_WIFI_SSID_HERE";
const char* password = "ENTER_WIFI_PASSWORD_HERE";

const long displayRefreshInterval = 15000;
long lastDisplayUpdate = (-1 * displayRefreshInterval) - 1000;

//ENTER STATIC IP OF THE ESP32 BOARD HERE
IPAddress local_IP(ENTER_STATIC_IP_HERE); //Format 0,1,2,3
IPAddress gateway(ENTER_GW_ADDRESS_HERE);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(ENTER_DNS_ADDRESS_HERE);
IPAddress secondaryDNS(8, 8, 8, 8);

Adafruit_HTU21DF htu = Adafruit_HTU21DF();

WiFiServer server(80);

int connectWifi(int connectDelay, bool restart){
  int wifi_retry = 0;
  while(WiFi.status() != WL_CONNECTED && wifi_retry < 5 ) {
      wifi_retry++;
      Serial.println("WiFi not connected. Try to reconnect");
      WiFi.disconnect();
      WiFi.mode(WIFI_OFF);
      WiFi.mode(WIFI_STA);
      WiFi.setAutoConnect(true);
      WiFi.setAutoReconnect(true);
      WiFi.begin(ssid.c_str(), password);
      delay(connectDelay);
  }
  if(restart && (wifi_retry >= 5)) {
      Serial.println("\nReboot");
      ESP.restart();
  }

  return wifi_retry;
}


void setup()
{
  Heltec.begin(true /*DisplayEnable Enable*/, false /*LoRa Disable*/, true /*Serial Enable*/);
  
  Heltec.display->setContrast(255);
  Heltec.display->setFont(ArialMT_Plain_10);

  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("STA Failed to configure");
  }

  Serial.print("Connecting to ");
  Serial.println(ssid);
  Heltec.display->clear();
  Heltec.display->drawString(0,0,"Connecting to:");
  Heltec.display->drawString(0,10,ssid);
  Heltec.display->display();

  if(connectWifi(500, false) >= 5) {
    Serial.println("");
    Serial.println("WiFi not connected. Will try to reconnect later!");
    Heltec.display->clear();
    Heltec.display->drawString(0,0,"Wifi not");
    Heltec.display->drawString(0,10,"connected!");
    Heltec.display->display();
    delay(5000);
  } else {
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

    Heltec.display->clear();
    Heltec.display->drawString(0,0,"Connected to:");
    Heltec.display->drawString(0,10,ssid);
    Heltec.display->display();
    delay(3000);
  }


  if (!htu.begin()) {
    Serial.println("Couldn't find sensor!");
    while (1);
  }

  Serial.println("Will set the bigger font now");
  Heltec.display->setFont(ArialMT_Plain_24);
  Heltec.display->clear();
  Heltec.display->display();

  Serial.println("Will start the server now");
  server.begin();
}

void loop()
{
  float temp = htu.readTemperature();
  float tempf = temp * 1.8 + 32;
  float rel_hum = htu.readHumidity();

  long now = millis();
  if((now - lastDisplayUpdate) > displayRefreshInterval){
    Serial.println("Updating display"); 
    lastDisplayUpdate = now;
    Heltec.display->clear();
    //Heltec.display->drawString(0,0,"Temperature:");
    //Heltec.display->drawString(0,15,String(temp)+"°C");
    //Heltec.display->drawString(0,35,"Humidity:");
    //Heltec.display->drawString(0,50,String(rel_hum)+"%rH");
    //Heltec.display->display();
    Heltec.display->drawString(0,0,String(temp)+"°C");
    Heltec.display->drawString(0,35,String(rel_hum)+"%rH");
    Heltec.display->display();
  }

  if (WiFi.status() != WL_CONNECTED) {
    connectWifi(500, true);
  }

  WiFiClient client = server.available();
  if (client) {
    if (client.connected()){
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
  }
  delay(100);
}
