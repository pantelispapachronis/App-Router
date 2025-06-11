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

def send_forecast_to_mqtt(payload):
    mqtt_client = mqtt.Client()
    mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)

    mqtt_client.publish(MQTT_TOPIC, json.dumps(payload))
    print(f"Publishing to topic '{MQTT_TOPIC}':", json.dumps(payload, indent=2))

    mqtt_client.disconnect()
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python mqtt_desk_availability.py <DESK_ID> <IS_AVAILABLE>")
        sys.exit(1)

    desk_id = sys.argv[1]
    is_available = sys.argv[2]

    print(f"Received Desk ID: {desk_id}, Is_Available: {is_available}")

    payload = {
        "BUILDING_DESKS": {
            "Id": desk_id,
            "Is_Available": is_available
        }
    }

    send_forecast_to_mqtt(payload)
