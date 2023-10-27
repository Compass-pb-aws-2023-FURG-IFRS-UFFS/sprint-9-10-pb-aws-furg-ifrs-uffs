from utils import create_response
from core.config import settings
import boto3
import requests
import json 
def handle_get_schedule_intent(event, context):
    try:
        slots = event['interpretations'][0]['intent']['slots']
        token = slots['Token']['value']['interpretedValue']
        student_id = slots['Matricula']['value']['interpretedValue']
        status, message = login(token, student_id)
        if not status:
            return create_response(event, f'Erro ao autenticar: {message}')
        schedule = get_schedule_from_student(student_id)
        if not schedule:
            return create_response(event, 'Não foi possível encontrar horários. Por favor, cadastre os horários fazendo upload do seu atestado de matrícula em formato HTML')
        schedule = format_text(schedule)

        return create_response(event, schedule)

    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")

def login(token, student_id):
    api_url = settings.AUTH_API_URL+'/token'
    data = {
        "token": token,
        "student_id": student_id
    }

    response = requests.post(api_url, json=data)
    response = response.json()
    message = response.get('message')
    status = response.get('status')
    return status, message

def get_schedule_from_student(student_id):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(settings.DYNAMO_DB_USERS_TABLE)
    student = table.get_item(Key = {'id':student_id})
    student =  student.get('Item', {})
    if not student:
        return False
    return student.get('schedule', False)

def format_text(data):
    formatted_text = ""
    
    for item in data:
        component_name = item.get('Componentes Curriculares', 'N/A')
        formatted_text += f"{component_name}:\n"
        formatted_text += f"    Horários: {item['Horário']}\n"
        formatted_text += f"    Professores: {item['Docentes']}\n"

    
    return formatted_text


def get_schedule_text(student_id):
    schedule = get_schedule_from_student(student_id)
    if not schedule:
        return ('Não foi possível encontrar horários. Por favor, cadastre os horários fazendo upload do seu atestado de matrícula em formato HTML')
    schedule = format_text(schedule)

    return schedule