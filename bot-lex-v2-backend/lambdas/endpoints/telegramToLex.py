import json
import boto3
import http.client
import uuid
import os
from dotenv import load_dotenv
from common.API_Responses import Responses 

lexv2 = boto3.client('lexv2-runtime')
user_conversation_mapping = {}
load_dotenv()

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        user_id = body['message']['from']['id']

        if user_id in user_conversation_mapping:
            session_id = user_conversation_mapping[user_id]
        else:
            session_id = str(uuid.uuid4())
            user_conversation_mapping[user_id] = session_id

        message_for_lex = map_telegram_to_lex(body)

        bot_id = os.environ.get('BOT_ID')
        bot_alias_id = os.environ.get('BOT_ALIAS_ID')

        lex_response = lexv2.recognize_text(
            botId =  bot_id,
            botAliasId = bot_alias_id,
            localeId='pt_BR',
            sessionId= session_id,
            text=message_for_lex
        )

        message_for_telegram = map_lex_to_telegram(lex_response, body)
        send_to_telegram(message_for_telegram)
        
        return Responses._200(message_for_telegram)

    except Exception as e:
        print('error in try catch', e)
        return Responses._400()

def map_telegram_to_lex(body):
    message = body['message']['text']
    return message

def map_lex_to_telegram(lex_response, body):
    message = lex_response['messages'][0]['content']
    chat_id = body['message']['chat']['id']
    return {
        'text': message,
        'chat_id': chat_id
    }

def send_to_telegram(message):
    token = os.environ.get('TELEGRAM_TOKEN')
    telegram_url = f'https://api.telegram.org/bot{token}/sendMessage'

    payload = json.dumps(message)

    conn = http.client.HTTPSConnection('api.telegram.org')

    conn.request('POST', telegram_url, body=payload, headers={'Content-type': 'application/json'})

    response = conn.getresponse()

    if response.status != 200:
        raise Exception(f'Chamada do telegram falhou com o código de erro {response.status}')
    
    response_data = response.read()
    print(response_data)

    conn.close()
