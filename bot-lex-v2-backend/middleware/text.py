import boto3
import json
import os
import gzip
import base64
from middleware.requests import *
import requests
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
    print(file)
    file_html = base64.b64encode(file).decode('utf-8')
    api_url=f'{settings.CC_API_BASE_URL}/dev/schedule/'
    headers = {
        'Content-Type': 'text/html; charset=utf-8',
    }
    response = requests.post(api_url, headers=headers, data=file.decode('iso-8859-1').encode('utf-8'))
    if response.status_code == 200:
        response_data = json.loads(response.text)
        print(response_data)
        send_message_telegram(chat_id, 'Foi!')
    else:
        response_data = json.loads(response.text)
        print(response_data)
        send_message_telegram(chat_id, response_data['Error'])


def resolve_user_text(chat_id, user_text):
    bot_id, bot_alias_id, locale_id = os.environ["LEX_BOT_ID"],os.environ["LEX_ALIAS_ID"],'pt_BR'


    # Send text to Lex
    lexv2_client = boto3.client('lexv2-runtime')
    try: 
        session_data = lexv2_client.get_session(botId= bot_id, botAliasId=bot_alias_id, localeId= locale_id, sessionId=str(chat_id))
        session_state = session_data.get('sessionState')
    
    except Exception as e:
        session_state = {}
    session_state = json.dumps(session_state)
    compressed_encoded_data = base64.b64encode(gzip.compress(session_state.encode('utf-8'))).decode('utf-8')

    lex_response = lexv2_client.recognize_utterance(
        botId = os.environ["LEX_BOT_ID"],
        botAliasId = os.environ["LEX_ALIAS_ID"],
        localeId = 'pt_BR',
        sessionId = str(chat_id),
        sessionState=compressed_encoded_data,
        requestContentType='text/plain;charset=utf-8',
        responseContentType='text/plain;charset=utf-8',
        inputStream = str.encode(user_text),
    )

    lex_messages = lex_response["messages"]
    decoded_data = gzip.decompress(base64.b64decode(lex_messages))
    lex_text = json.loads((decoded_data.decode()))[0]['content']

    splited_lex_text = lex_text.split('\\n')
    for text in splited_lex_text:
        #Returns to the user the text result/
        send_message_telegram(chat_id, text)

    return {"body" : json.dumps({}),"statusCode": 200}