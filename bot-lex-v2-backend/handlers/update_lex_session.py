from services.lex_service import update_session_state
import json
from middleware.requests import send_message_telegram
from controllers.schedule_controller import get_schedule_text


def handler(event, request):
    print(event)
    body = json.loads(event['body'])
    print(body)
    student_id = body['student_id']
    print(student_id)
    token = body['token']
    session_id = body['chat_id']

    update_session_state(session_id, token, student_id)
    send_message_telegram(session_id, get_schedule_text(student_id))