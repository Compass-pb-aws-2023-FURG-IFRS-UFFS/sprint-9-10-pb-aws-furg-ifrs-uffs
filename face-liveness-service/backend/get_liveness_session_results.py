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
  
        response = {"status": result.get("Status"), "confidence":result.get("Confidence")}
        return create_response(200, response)
    except Exception as e:
        print(str(e))
        response = create_response(500,{"status": "Erro no serviço de Liveness"})
        return response

