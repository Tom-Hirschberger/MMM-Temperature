#define MAX_TEMP_DIFF 2.0
#define MAX_ENVIRONMENT_TIME_DIFF 30000

const int oneWireBus = 4; //thats the GPIO to use (i.e GPIO4 is Pin D2)
const char* SSID = "ENTER_WIFI_SSID_HERE";
const char* PSK = "ENTER_WIFI_PASSWORD_HERE";
const char* mqtt_broker = "ENTER_MQTT_SERVER_ADDRESS_HERE";
const char* mqtt_user = "ENTER_MQTT_USERNAME_HERE";
const char* mqtt_pass = "ENTER_MQTT_PASSWORD_HERE";
const char* ota_user = "ENTER_OTA_USER_HERE";
const char* ota_pass = "ENTER_OTA_PASSWORD_HERE";
const String host_name = "ESP";
const String client_name = "ESP";
const String topic_id = "esp";
