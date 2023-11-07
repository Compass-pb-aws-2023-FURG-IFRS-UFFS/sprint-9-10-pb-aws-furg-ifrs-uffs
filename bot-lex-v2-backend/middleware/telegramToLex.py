import boto3
import json
import traceback
from utils import parse_event_body
from middleware.requests import send_message_telegram
from middleware.text import *
from middleware.audio import handle_audio

def telegram_handler(event, context):

    try:
        body = parse_event_body(event, ["message"])
        message = body["message"]
        chat_id = body["message"]["chat"]["id"]
        print(body)
        if message.get("text"):
            resolve_user_text(chat_id, body["message"]["text"])
        elif message.get('document',{}).get('mime_type') == 'text/html':
            handle_html_input(chat_id, message.get('document'))
        elif message.get('photo'):
            handle_photo_input(chat_id, message.get('photo'))
        elif message.get('voice'):
            transcribe_text = handle_audio(chat_id, message['voice'].get('file_id'))
            if transcribe_text:
                resolve_user_text(chat_id, transcribe_text.replace('.',' '))
            else:
                send_message_telegram(chat_id,"Não entendi o que você falou, envie novamente por favor.")
        else:
            send_message_telegram(chat_id, "Perdão, eu ainda não tenho a capacidade para responder o que você escreveu.")

    except Exception as e:
        traceback.print_exc()
        send_message_telegram(chat_id, f"Houve um erro no bot: {str(e)}")
    
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