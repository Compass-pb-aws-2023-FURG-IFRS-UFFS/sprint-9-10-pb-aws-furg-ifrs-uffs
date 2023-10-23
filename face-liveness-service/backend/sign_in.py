
import json
from services.rekognition_service import get_face_analysis, get_student_id_from_image
from services.dynamodb_service import get_student_from_id, save, update_student_photo
from services.bucket_service import save_to_bucket
import traceback
from exceptions.auth_exception import AuthException
from exceptions.base_exception import BaseException
from utils import create_response

def handle_text_detection_response(data):
    student_id = None
    for detection in data['TextDetections']:
        if 'Matricula' in detection['DetectedText']:
            student_id = detection['DetectedText']
            break
    if not student_id:
        raise AuthException(400, 'Não foi possível encontrar a matrícula a partir dessa foto. Faça download da carteirinha no  https://sci.uffs.edu.br/ como jpeg e tente novamente')
    return student_id.split(':')[1].strip()

def is_high_confidence(data, threshold=80):
    if 'FaceDetails' in data:
        face_details = data['FaceDetails']
        if len(face_details) > 0:
            confidence = face_details[0].get('Confidence', 0)
            return confidence >= threshold
    return False

def sign_in_handler(event, context):
    # print(event)
    try:
        body = event["body"]
        image = body["image"]
        image = image.encode('iso-8859-1')
        
        response_faces = get_face_analysis(image)
        response_text = get_student_id_from_image(image)
        print(response_faces)
        print(response_text)

        student_id = handle_text_detection_response(response_text)
        if is_high_confidence(response_faces):
            image_key = save_to_bucket(image, student_id)
        student = get_student_from_id(student_id)
        if student:
            update_student_photo(student, image_key)
            message = f'Dados do aluno {student_id} atualizado com sucesso!'
        else:
            save({'id': student_id, 'image_key': image_key})
            message = f'Dados do aluno {student_id} salvos com sucesso!'
        
        return create_response(200, {'message': message})
    
    except BaseException as be:
        return create_response(be.status_code, {"message": str(be)})
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return {
            'statusCode': 400,
            'body': 'Invalid request.'
        }