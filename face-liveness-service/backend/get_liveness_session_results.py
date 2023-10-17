import boto3
import json
import os
from utils import create_response, get_formatted_datetime

def handler(event, context):
    try:
        body = json.loads(event['body'])
        session_id = body['session']
        client = boto3.client('rekognition')
        result = client.get_face_liveness_session_results(
            SessionId=session_id)
        print(result)
        if float(result.get('Confidence')) > 50.0:
            key = save_to_bucket(result['ReferenceImage'].get('Bytes'))
        else:
            return create_response(400,{"status": "Não podemos confirmar Liveness"})
  
        response = {"status": result.get("Status"), "confidence":result.get("Confidence"), "key": key}
        return create_response(200, response)
    except Exception as e:
        print(str(e))
        response = create_response(500,{"status": "Erro no serviço de Liveness"})
        return response

            
def save_to_bucket(image, bucket=os.environ.get('BUCKET_NAME')):
    s3 = boto3.client('s3')
    object_key = f'face-recognized-{get_formatted_datetime()}.jpeg'
    s3.put_object(Bucket = bucket, Key = f'liveness/{object_key}',Body=image)
    return object_key