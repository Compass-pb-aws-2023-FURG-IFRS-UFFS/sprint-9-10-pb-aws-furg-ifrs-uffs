import json 
import boto3
import requests

from core.config import settings
from utils import create_response


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