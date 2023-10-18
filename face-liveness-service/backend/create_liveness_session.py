from utils import create_response
from services.rekognition_service import create_face_liveness_session

def handler(event, context):
    try:
        
        response = create_face_liveness_session()
        session_id = response.get("SessionId")
        return create_response(200, {"sessionId": session_id})
    except Exception as e:
        print(str(e))