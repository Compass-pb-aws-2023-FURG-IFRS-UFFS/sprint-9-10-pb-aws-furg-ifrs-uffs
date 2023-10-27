import boto3
from core.config import settings

def update_session_state(session_id, token, student_id):
    lex_runtime = boto3.client('lexv2-runtime')
    bot_id, alias_id, locale_id = settings.LEX_BOT_ID, settings.LEX_ALIAS_ID, 'pt_BR'
    response = lex_runtime.get_session(
        botId=bot_id,
        botAliasId=alias_id,
        localeId = locale_id,
        sessionId=session_id
    )
    print(response)

    session_state = response['sessionState']

    session_state['sessionAttributes'] = {'token': token, "studentId": student_id}  
    print(session_state)

    lex_runtime.put_session(
        botId=bot_id,
        botAliasId=alias_id,
        localeId = locale_id,
        sessionId=session_id,
        sessionState=session_state
    )

    print(f"Session {session_id} has been updated with token: {token}")
    response = lex_runtime.get_session(
        botId=bot_id,
        botAliasId=alias_id,
        localeId = locale_id,
        sessionId=session_id
    )
    print('atualiazada', response)