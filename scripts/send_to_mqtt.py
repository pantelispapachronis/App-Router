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

    # Transform the dictionary to a JSON string and publish it
    mqtt_client.publish(MQTT_TOPIC, json.dumps(desk_preferences))
    print(f"Message Published: {desk_preferences}")

    mqtt_client.disconnect()
    return True

    # Get data from the command line
if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Usage: python send_to_mqtt.py <EMPLOYEE_ID> <DeskPref_A> <DeskPref_B> <DeskPref_C> <PRESENCE>")
        sys.exit(1)

    # Get the data from the command line
    employee_id = sys.argv[1]
    desk_pref_a = sys.argv[2]
    desk_pref_b = sys.argv[3]
    desk_pref_c = sys.argv[4]
    presence = sys.argv[5].upper()  # Convert to uppercase

    # Create the dictionary
    desk_preferences = {
        "employee_id": employee_id,
        "preferences": {
            "DeskPref_A": desk_pref_a,
            "DeskPref_B": desk_pref_b,
            "DeskPref_C": desk_pref_c
        },
        "presence": presence
    }

    # If presence is TRUE, send the data to MQTT
    if presence == "TRUE":
        send_forecast_to_mqtt(desk_preferences)
    else:
        print("Presence is FALSE, not sending data.")
