import paho.mqtt.client as mqtt
import json
import warnings

warnings.filterwarnings("ignore", category=DeprecationWarning)

MQTT_BROKER = "172.16.0.51"
MQTT_PORT = 1883
MQTT_SEND_TOPIC = "monitor_testing/AEROS"
MQTT_SUBSCRIBE_TOPIC = "monitor_testing/recommender_status"
MQTT_USERNAME = "aeros"
MQTT_PASSWORD = "aerosPass*2024*"


def send_forecast_to_mqtt(json_data):
    mqtt_client = mqtt.Client()
    mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)

    mqtt_client.publish(MQTT_SEND_TOPIC, json.dumps(json_data))

    print("Message Published")
    mqtt_client.disconnect()
    return True


building_desks = {
    "desk_id": "R105_01",
    "is_available": "TRUE"
}

desk_preferences = {
    "employee_id": "A1020002",
    "preferences": {
        "desk1": "R105_01",
        "desk2": "R106_02",
        "desk3": "R208_04"
    },
    "presence": "TRUE"
}

send_forecast_to_mqtt(desk_preferences)

# %23 is # in orion
