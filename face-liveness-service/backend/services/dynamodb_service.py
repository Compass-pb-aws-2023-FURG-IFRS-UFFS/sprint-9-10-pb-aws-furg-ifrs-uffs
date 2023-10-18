import boto3
from config import settings
from datetime import datetime
import uuid

dynamodb = boto3.resource('dynamodb')
database_table = dynamodb.Table(settings.DYNAMODB_USERS_TABLE)


def get_student_from_id(student_id, table=database_table):
    student = table.get_item(Key = {'id':student_id})

    if student:
        return student['Item']
    

def update_student(student, table = database_table):
    unique_id = str(uuid.uuid1())
    current_datetime = datetime.utcnow()
    datetime_str = current_datetime.isoformat()

    update_expression = "SET #timestampAttr = :newTimestamp, #tokenAttr = :new_token"
    expression_attribute_values = {
        ':newTimestamp': datetime_str,
        ':new_token': unique_id
    }

    expression_attribute_names = {
        '#timestampAttr': 'token_creation_timestamp',
        '#tokenAttr': 'token',  
    }

    # Update item in DynamoDB
    table.update_item(
        Key={'id': student['id']},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values,
        ExpressionAttributeNames=expression_attribute_names,
    )

    return unique_id