
import json
from services.rekognition_service import get_face_analysis, get_student_id_from_image
from services.dynamodb_service import get_student_from_id, save, update_student_photo
from services.bucket_service import delete_from_bucket
import traceback
from exceptions.auth_exception import AuthException
from exceptions.base_exception import BaseException
from utils import create_response, normalize_text

def handle_text_detection_response(data):
    student_id = None
    for detection in data['TextDetections']:
        detected_text = detection['DetectedText']
        detected_text = normalize_text(detected_text)
        if 'matricula' in detected_text:
            student_id = detected_text
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
        key = body["key"]
        print(key)
        
        response_faces = get_face_analysis(key)
        response_text = get_student_id_from_image(key)
        print(response_faces)
        print(response_text)

        student_id = handle_text_detection_response(response_text)
        if not is_high_confidence(response_faces):
            raise AuthException(400, 'Não foi possível encontrar um rosto válido nessa imagem. Faça novamente o download da carteirinha e tente novamente')
            
        
        student = get_student_from_id(student_id)
        if student:
            update_student_photo(student, key)
            message = f'Dados do aluno {student_id} atualizado com sucesso!'
        else:
            save({'id': student_id, 'image_key': key})
            message = f'Dados do aluno {student_id} salvos com sucesso!'
        
        return create_response(200, {'message': message})
    
    except BaseException as be:
        delete_from_bucket(key)
        return create_response(be.status_code, {"message": str(be)})
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return create_response(500, {"message": 'Algo deu errado no servidor!'})