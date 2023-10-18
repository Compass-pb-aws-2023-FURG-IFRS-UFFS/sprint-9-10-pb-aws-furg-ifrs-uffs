from services.rekognition_service import get_liveness_session_results, compare_faces
from services.dynamodb_service import *
from utils import create_response
import traceback
import json

def handler(event, context):
    try:
        body = json.loads(event['body'])
        session_id = body['session']
        student_id = body['student_id']
        liveness_results = get_liveness_session_results(session_id)
        if float(liveness_results.get('Confidence')) > 50.0:
            liveness_image = liveness_results['ReferenceImage'].get('Bytes')
            token = authenticate(student_id, liveness_image)
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