import boto3
from config import settings
from exceptions.auth_exception import AuthException
from botocore.exceptions import ClientError
from exceptions.aws_exceptions.rekognition_exception import RekognitionException
rekognition = boto3.client('rekognition')


def create_face_liveness_session():
    response = rekognition.create_face_liveness_session()
    return response

def get_liveness_session_results(session_id):
    result = rekognition.get_face_liveness_session_results(SessionId=session_id)
    return result

def create_image_object(key, bucket = settings.BUCKET_NAME):
    return {'S3Object': {'Bucket': bucket, 'Name': key}}

def compare_faces(student, liveness):
    student_image = student.get('image_key', 'nulo')
    student_image = create_image_object(f'users/{student_image}')
    try:
        response = rekognition.compare_faces(
            SourceImage=student_image,
            TargetImage={'Bytes': liveness},
        )
        print(response)
        similarities = []
        for faceMatch in response['FaceMatches']:
            similarities.append(float(faceMatch['Similarity']))
        if not similarities:    
            raise AuthException(400, "Falha na autenticação: Rosto não reconhecido!")
        similarity = max(similarities)
        return similarity
    except ClientError as ce:
        error_code = ce.response['Error']['Code']
        raise RekognitionException.handle_rekognition_exception(error_code)


