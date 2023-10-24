from utils import create_response, get_name
import boto3
import json

def handle_get_contact_intent(event, context):
    try:
        slots = event['interpretations'][0]['intent']['slots']
        teacher_name = slots.get("Professor", {}).get("value")
        response_message = get_name(teacher_name)

        return create_response(event, response_message)

    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")
