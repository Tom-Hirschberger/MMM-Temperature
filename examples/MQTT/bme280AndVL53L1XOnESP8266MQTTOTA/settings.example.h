#define MAX_TEMP_DIFF 2.0
#define MAX_HUMDITY_DIFF 5.0
#define MAX_ENVIRONMENT_TIME_DIFF 30000
#define MAX_DISTANCE_DIFF 100
#define MAX_DISTANCE_TIME_DIFF 300000
#define DISTANCE_MODE VL53L1X::Long //the sensor supports Short, Mid, Long mode
#define TIMING_BUDGET 50000
#define TIMING_CONTINOUES 50
#define TIMEOUT 100

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
