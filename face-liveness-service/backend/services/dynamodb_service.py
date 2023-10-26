import boto3
from config import settings
from datetime import datetime
import uuid

dynamodb = boto3.resource('dynamodb')
database_table = dynamodb.Table(settings.DYNAMODB_USERS_TABLE)


def get_student_from_id(student_id, table=database_table):
    student = table.get_item(Key = {'id':student_id})
    return student.get('Item', None)
    

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

def update_student_photo(student, key, table = database_table):

    update_expression = "SET #image_key = :key"
    expression_attribute_values = {
        ':key': key,
    }

    expression_attribute_names = {
        '#image_key': 'image_key'
    }

    # Update item in DynamoDB
    table.update_item(
        Key={'id': student['id']},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values,
        ExpressionAttributeNames=expression_attribute_names,
    )


def save(item, table = database_table):
    table.put_item(Item = item)


def select_all(table = database_table):
    return table.scan()