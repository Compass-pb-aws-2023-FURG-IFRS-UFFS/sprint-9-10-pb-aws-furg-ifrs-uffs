import boto3
import json
import traceback
from utils import parse_event_body
from middleware.requests import send_message_telegram
from middleware.text import *

def telegram_handler(event, context):

    try:
        body = parse_event_body(event, ["message"])
        message = body["message"]
        chat_id = body["message"]["chat"]["id"]

        if message.get("text"):
            resolve_user_text(chat_id, body["message"]["text"])

        else:
            send_message_telegram(chat_id, "Perdão, eu ainda não tenho a capacidade para responder o que você escreveu.")

    except Exception as e:
        traceback.print_exc()
        send_message_telegram(chat_id, "Houve um erro no bot: ", str(e))
    
    finally:
        return {
            "body" : json.dumps({}),
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            }
        }