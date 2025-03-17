import paho.mqtt.client as mqtt
import json
import warnings
import sys

warnings.filterwarnings("ignore", category=DeprecationWarning)

MQTT_BROKER = "172.16.0.51"
MQTT_PORT = 1883
MQTT_TOPIC = "monitor_testing/AEROS"
MQTT_USERNAME = "aeros"
MQTT_PASSWORD = "aerosPass*2024*"

def send_forecast_to_mqtt(desk_preferences):
    """sedn dynamic data to MQTT"""
    mqtt_client = mqtt.Client()
    mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    # print("TEST - Arguments received:", sys.argv)


    # Transform the dictionary to a JSON string and publish it
    mqtt_client.publish(MQTT_TOPIC, json.dumps(desk_preferences))
    print(f"Message Published: {desk_preferences}")

    mqtt_client.disconnect()
    return True

    # Get data from the command line
if __name__ == "__main__":
    if len(sys.argv) < 3:
        # print("TEST - Arguments received:", sys.argv)
        print("Usage: python mqtt_desk_availability.py <DESK_ID> <IS_AVAILABLE>")
        sys.exit(1)

    # Get the data from the command line
    desk_id = sys.argv[1]
    is_available = sys.argv[2]

    building_desks = {
        "desk_id": desk_id,
        "is_available": is_available
    }

    send_forecast_to_mqtt(building_desks)
