from services.dynamodb_service import get_student_from_id
from utils import create_response
from datetime import datetime
import json
import traceback
from config import settings

expiration_in_minutes = int(settings.TOKEN_EXPIRATION_IN_MINUTES)
def get_data_from_body(body):
    token = body.get('token', None)
    student_id = body.get('student_id', None)
    
    if not (token and student_id):
        raise ValueError('Informe token e student_id')
    
    return token, student_id


def check_expiration(student, expiration_in_minutes = expiration_in_minutes):
    timestamp_str = student['token_creation_timestamp']
    timestamp = datetime.strptime(timestamp_str, '%Y-%m-%dT%H:%M:%S.%f')
    current_time = datetime.utcnow()
    time_difference = current_time - timestamp
    time_difference_minutes = time_difference.total_seconds() / 60
        
    if time_difference_minutes >= expiration_in_minutes:
        return False, 'Token expirado'
    return True, 'Token válido'
    

def handler(event, context):
    try:
        body = json.loads(event['body'])
        token, student_id = get_data_from_body(body)
        student = get_student_from_id(student_id)
        if not student:
            return create_response(404, create_body(False,'Matricula não encontrada'))
        if not student.get('token') == token:
            return create_response(400, create_body(False,'Token inválido'))
        
        status, message = check_expiration(student)
        return create_response(200, create_body(status, message))
    except ValueError as ve:
        traceback.print_exc()
        return create_response(create_body(400,str(ve)))
    except Exception as e:
        traceback.print_exc()
        return create_response(500, create_body(False, 'Algo deu errado na verificação do token'))
    
def create_body(status, message):
    return {"status": status, "message": message}