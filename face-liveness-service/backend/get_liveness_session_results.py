import boto3
import json
import os
from utils import create_response, get_formatted_datetime
import uuid
from datetime import datetime
import traceback

def handler(event, context):
    try:
        body = json.loads(event['body'])
        session_id = body['session']
        student_id = body['student_id']
        client = boto3.client('rekognition')
        result = client.get_face_liveness_session_results(
            SessionId=session_id)
        print(result)
        if float(result.get('Confidence')) > 50.0:
            key = save_to_bucket(result['ReferenceImage'].get('Bytes'))
            token = authenticate(student_id, key)
            if token:
                return create_response(200, {"status": "SUCCEEDED", "token": token })
            return create_response(200, {"status": "Não deu match de rostos"})
        else:
            return create_response(400,{"status": "Não podemos confirmar Liveness"})
  

    except Exception as e:
        print(str(e))
        traceback.print_exc()
        response = create_response(500,{"status": "Erro no serviço de Liveness"})
        return response

            
def save_to_bucket(image, bucket=os.environ.get('BUCKET_NAME')):
    s3 = boto3.client('s3')
    object_key = f'face-recognized-{get_formatted_datetime()}.jpeg'
    s3.put_object(Bucket = bucket, Key = f'liveness/{object_key}',Body=image)
    return object_key

def authenticate(student_id, liveness_image):

    student = get_student_from_id(student_id)
    print(student)
    similarity = compare_faces(student, liveness_image)
    print(similarity)
    if float(similarity) >= 80.0:
        unique_id = update_student(student)
        print(unique_id)
        return unique_id
    return False

def get_student_from_id(student_id, table = os.environ.get('DYNAMO_DB_USERS_TABLE')):
    db = boto3.resource('dynamodb')
    table = db.Table(table)

    student = table.get_item(Key = {'id':student_id})

    if student:
        return student['Item']

def create_image_object(key, bucket = os.environ.get('BUCKET_NAME')):
    return {'S3Object': {'Bucket': bucket, 'Name': key}}

def compare_faces(student, liveness):
    student_image = student['image_key']
    student_image = create_image_object(f'users/{student_image}')
    liveness_image = create_image_object(f'liveness/{liveness}')
    rekognition = boto3.client('rekognition')

    response = rekognition.compare_faces(
        SourceImage=student_image,
        TargetImage=liveness_image,
    )
    print(response)
    similarities = []
    for faceMatch in response['FaceMatches']:
        similarities.append(float(faceMatch['Similarity']))
    similarity = max(similarities)
    return similarity


def update_student(student, table = os.environ.get('DYNAMO_DB_USERS_TABLE')):
    db = boto3.resource('dynamodb')
    table = db.Table(table)
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