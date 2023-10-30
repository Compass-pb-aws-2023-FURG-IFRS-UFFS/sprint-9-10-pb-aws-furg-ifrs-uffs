import json
import boto3 

from services.dynamo import update_student, get_student_from_id
from web_scraping.schedule import extract_student_id_from_html, extract_classes_info


def update_schedule(event):
    body = event.get('body')
    html = body

    student_id = extract_student_id_from_html(html)
    
    print(student_id)
    if not student_id:
        return create_response(500, {"Error":"Ocorreu erro ao ler esse arquivo: Não encontramos a matricula"})
    student = get_student_from_id(student_id)
    if not student:
        return create_response(404, {"Error":"Vocẽ precisa estar cadastrado no sistema para informar seus horários!"})

    schedule = extract_classes_info(html)
    update_student(student_id, schedule)
    
    return create_response(200, {'schedule': schedule})


def create_response(statusCode, body=''):

    return {
        'statusCode': statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json; charset=utf-8",

        },
        'body': json.dumps(body)
    }
