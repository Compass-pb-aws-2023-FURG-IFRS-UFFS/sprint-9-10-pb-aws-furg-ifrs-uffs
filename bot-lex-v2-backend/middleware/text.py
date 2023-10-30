import os
import gzip
import json
import boto3
import base64
import requests

from middleware.requests import send_message_telegram, get_file_details_telegram, get_file_telegram
from controllers.schedule_controller import login, get_schedule_text, update_schedule
from core.config import settings
from datetime import datetime



def save_to_bucket(image,bucket=os.environ.get('BUCKET_NAME')):
    s3 = boto3.client('s3')
    object_key = f'users/{datetime.now().strftime("%d-%m-%y %H:%M:%S")}.jpeg'
    s3.put_object(Bucket = bucket, Key = object_key,Body=image)
    return object_key


def handle_photo_input(chat_id, input):
    highest_photo = max(input, key=lambda x: x["file_size"])

    file_details = get_file_details_telegram(highest_photo['file_id'])
    file = get_file_telegram(file_details['file_path'])
    key = save_to_bucket(file)
    # file = file.decode('iso-8859-1')
    print(file_details)
    client = boto3.client('lambda')
    invoke_response = client.invoke(FunctionName=settings.SIGN_IN_LAMBDA, Payload = json.dumps({'body' : {'key': key}}))
    payload = json.load(invoke_response['Payload'])
    body = json.loads(payload['body'])
    message = body.get('message', 'Algo deu errado ao cadastrar usuário')
    send_message_telegram(chat_id, str(message))    


def handle_html_input(chat_id, input):
    file_details = get_file_details_telegram(input['file_id'])
    file = get_file_telegram(file_details['file_path'])
    return send_message_telegram(chat_id,update_schedule(file))



def resolve_user_text(chat_id, user_text):
    bot_id, bot_alias_id, locale_id = os.environ["LEX_BOT_ID"],os.environ["LEX_ALIAS_ID"],'pt_BR'


    # Send text to Lex
    lexv2_client = boto3.client('lexv2-runtime')
    try: 
        session_data = lexv2_client.get_session(botId= bot_id, botAliasId=bot_alias_id, localeId= locale_id, sessionId=str(chat_id))
        session_state = session_data.get('sessionState')
    
    except Exception as e:
        session_state = {}
    # session_state = json.dumps(session_state)
    # compressed_encoded_data = base64.b64encode(gzip.compress(session_state.encode('utf-8'))).decode('utf-8')

    lex_response = lexv2_client.recognize_text(
        botId = bot_id,
        botAliasId = bot_alias_id,
        localeId = locale_id,
        sessionId = str(chat_id),
        text = user_text
    )

    print(lex_response)
    session_state = lex_response['sessionState']
    message = lex_response['messages'][0]['content']
    if session_state.get('intent', {}).get('name') == 'ScheduleIntent':
        session_attr = session_state.get('sessionAttributes')

        token, student_id = session_attr.get('token'), session_attr.get('studentId')
        print(token, student_id)
        if token:
            status, login_response = login(token, student_id)
            print(status, login_response)
            if status:
                print('status true')
                send_message_telegram(chat_id,get_schedule_text(student_id))
                return {"body" : json.dumps({}),"statusCode": 200}

            else:
                message = f'{login_response}\n{message}/?id={str(chat_id)}'
        else:
            message = f'{message}/?id={str(chat_id)}'
    splited_lex_text = message.split('\\n')
    for text in splited_lex_text:
        #Returns to the user the text result/
        send_message_telegram(chat_id, text)

    return {"body" : json.dumps({}),"statusCode": 200}