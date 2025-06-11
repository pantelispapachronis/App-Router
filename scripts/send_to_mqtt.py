import paho.mqtt.client as mqtt
import json
import sys

MQTT_BROKER = "172.16.0.51"
MQTT_PORT = 1883
MQTT_TOPIC = "monitor_testing/AEROS"
MQTT_USERNAME = "aeros"
MQTT_PASSWORD = "aerosPass*2024*"

def send_to_mqtt(data):
    client = mqtt.Client()
    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.publish(MQTT_TOPIC, json.dumps(data))
    print("Published to MQTT:")
    print(json.dumps(data, indent=2))  
    client.disconnect()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python send_to_mqtt.py '<json_string>'")
        sys.exit(1)

    try:
        payload = json.loads(sys.argv[1])
        # print(payload.get("Presence"))
        if payload.get("Presence") == 0:    
            payload["Presence"] = "FALSE"
        else:    
            payload["Presence"] = "TRUE"
        send_to_mqtt(payload)
        # if payload.get("Presence") == 1:
        #     send_to_mqtt(payload)
        # else:
        #     print("Presence is False — message not sent.")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
