import paho.mqtt.client as mqtt
import json
import warnings
import time


warnings.filterwarnings("ignore", category=DeprecationWarning)

MQTT_BROKER = "172.16.0.51"
MQTT_PORT = 1883
MQTT_TOPIC = "monitor_testing/recommender_status"
MQTT_USERNAME = "aeros"
MQTT_PASSWORD = "aerosPass*2024*"


def on_message(client, userdata, message):
    try:
        payload = json.loads(message.payload.decode("utf-8"))
        print(payload)
        if "status" in payload and "employee_id":
            status = payload["status"]
            employee_id = payload["employee_id"]
            return True
            #exit()
            # print(f"Status {status} for Employee {employee_id}")
            #return payload
        else:
            return False
    except json.JSONDecodeError:
        print("Received invalid JSON data")
        return False


def on_connect(client, userdata, flags, rc):

    # To be removed test_data in production
    test_data = {
    "employee_id": "A1020002",
    "status": "OK"
    }

    if rc == 0:
        print(json.dumps(test_data))

        client.subscribe(MQTT_TOPIC)
    else:
        print("Failed to connect, return code:", rc)


def subscribe_to_mqtt():
    mqtt_client = mqtt.Client()
    mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message

    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    # mqtt_client.loop_forever() Uncomment this in production to keep the client connected and listening for messages

    #Test loop_start - to be removed in production
    mqtt_client.loop_start()
    time.sleep(5)  



subscribe_to_mqtt()
