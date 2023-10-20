import boto3
import json
import os
import gzip
import base64
from middleware.requests import send_message_telegram

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