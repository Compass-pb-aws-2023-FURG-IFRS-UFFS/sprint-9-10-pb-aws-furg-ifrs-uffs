import json
import pytz
from datetime import datetime


def create_response(event, msgText):
  response = {
          "sessionState": {
            "dialogAction": {
              "type": "Close"
            },
            "intent": {
              "name": event['sessionState']['intent']['name'],
              "slots": event['sessionState']['intent']['slots'],
              "state": "Fulfilled"
            }
          },
          "messages": [
            {
              "contentType": "PlainText",
              "content": msgText
            }
            ]
        }
      
  return response


def get_formatted_datetime():
    brazil_timezone = pytz.timezone('America/Sao_Paulo')
    return datetime.now(brazil_timezone).strftime("%d/%m/%y %H:%M:%S")


def parse_event_body(event, required_params=None):

    if event.get("body") == None:
        raise Exception("Invalid input: Missing body")
    
    body = json.loads(event["body"]) if type(event["body"]) is not dict else event["body"]

    if required_params:
        for required_param in required_params:
            if body.get(required_param) == None:
                raise Exception(f"Invalid input: Missing {required_param} param")
    
    return body