from services.dynamo import get_schedule_from_student 
import requests
from services.dynamo import update_student, get_student_from_id
from web_scraping.schedule import extract_student_id_from_html, extract_classes_info

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

def update_schedule(html):
    print(html)
    student_id = extract_student_id_from_html(html)
    print(student_id)
    if not student_id:
        return "Ocorreu erro ao ler esse arquivo: Não encontramos a matricula no arquivo. Lembre-se, envie o atestado de matrícula em formato HTML."
    student = get_student_from_id(student_id)
    if not student:
        return "Vocẽ precisa estar cadastrado no sistema para informar seus horários!"
    schedule = extract_classes_info(html)
    update_student(student_id, schedule)
    response = f'Horários do aluno {student_id} atualizados com sucesso!\n' + format_text(schedule)
    return response

