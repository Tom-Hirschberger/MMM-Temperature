#include <heltec.h>
#include <ESP8266WiFi.h>
#include "Adafruit_HTU21DF.h"

#define VALUE_DISPLAY_TIME 5000
#define BTN_DEBOUNCE_DELAY 300

//MAKE SURE TO CONNECT THE SENSOR TO PINS 4 AND 15
//THIS IS BECAUSE OF THE OLED

const String ssid     = "ENTER_WIFI_SSID_HERE";
const char* password = "ENTER_WIFI_PASSWORD_HERE";

const long displayRefreshInterval = 1000;
long lastDisplayUpdate = (-1 * displayRefreshInterval) - 1000;

//ENTER STATIC IP OF THE ESP8266 BOARD HERE
IPAddress local_IP(ENTER_BOARD_IP_HERE); //Format 0,1,2,3
IPAddress gateway(ENTER_GATEWAY_IP_HERE);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(ENTER_DNS_IP_HERE);
IPAddress secondaryDNS(8, 8, 8, 8);

Adafruit_HTU21DF htu = Adafruit_HTU21DF();

int btn_pin = 13;
bool btn_state = false;
long btn_last_pressed = 0;
bool update_values = false;
bool values_visible = false;

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

void ICACHE_RAM_ATTR btn_pressed(){
  long cur_time = millis();
  if((cur_time - btn_last_pressed) > BTN_DEBOUNCE_DELAY){
    btn_last_pressed = cur_time;
    btn_state = true;
  }
}

void setup()
{
  Heltec.begin();
  
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

  pinMode(btn_pin, INPUT);

  attachInterrupt(digitalPinToInterrupt(btn_pin), btn_pressed, HIGH);

  if(connectWifi(2000, false) >= 5) {
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
  Heltec.display->setFont(ArialMT_Plain_16);
  Heltec.display->clear();
  Heltec.display->display();

  Serial.println("Will start the server now");
  server.begin();
}

void displayValues(long curTime, float temp, float humidity){
  if((curTime - lastDisplayUpdate) > displayRefreshInterval){
    Serial.println("Updating display"); 
    lastDisplayUpdate = curTime;
    Heltec.display->clear();
    Heltec.display->drawString(0,0,String(temp)+"°C");
    Heltec.display->drawString(0,17,String(humidity)+"%rH");
    Heltec.display->display();
  }
}

void loop()
{
  float temp = htu.readTemperature();
  float tempf = temp * 1.8 + 32;
  float rel_hum = htu.readHumidity();

  long curTime = millis();

  //display_values = false;
  //bool values_visible = false;
  
  if (btn_state) {
    Serial.println("Button pressed");
    btn_state = false;
    update_values = true;
  } else {
    if ((curTime - btn_last_pressed) > VALUE_DISPLAY_TIME) {
      update_values = false;
      if (values_visible){
        Heltec.display->clear();
        Heltec.display->display();  
        values_visible = false;
      }
    } else {
      update_values = true;
    }
  }

  if(update_values){
    Serial.println("Updating the oled");
    values_visible = true;
    displayValues(curTime, temp, rel_hum);
  }

  if (WiFi.status() != WL_CONNECTED) {
    connectWifi(1000, true);
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
