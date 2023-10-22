from core.config import settings
from services.scrapping.extract_schedule import extract_student_id_from_html, extract_classes_info
import boto3 
from utils import create_response

dynamodb = boto3.resource('dynamodb')
database_table = dynamodb.Table(settings.DYNAMODB_USERS_TABLE)


def get_student_from_id(student_id, table=database_table):
    student = table.get_item(Key = {'id':student_id})
    return student.get('Item', None)

def update_student(student_id, schedule, table = database_table):
    update_expression = "SET #schedule = :newSchedule"
    expression_attribute_values = {
        ':newSchedule': schedule
    }

    expression_attribute_names = {
        '#schedule': 'schedule',
    }

    response = table.update_item(
        Key={'id': student_id},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values,
        ExpressionAttributeNames=expression_attribute_names,
    )
    return True


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

