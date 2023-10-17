import boto3
import json
from utils import create_response


def handler(event, context):
    try:
        client = boto3.client('rekognition')
        
        response = client.create_face_liveness_session()
        session_id = response.get("SessionId")
        
        return create_response(200, {"sessionId": session_id})
    except Exception as e:
        print(str(e))