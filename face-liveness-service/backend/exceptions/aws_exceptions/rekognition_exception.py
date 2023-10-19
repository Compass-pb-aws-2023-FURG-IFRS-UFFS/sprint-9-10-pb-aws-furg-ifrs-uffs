from exceptions.base_exception import BaseException

class RekognitionException(BaseException):
    def __init__(self,message="Algo deu errado no serviço de Reconhecimento Facial", status_code=500):
        super().__init__(message, status_code)

    @staticmethod
    def handle_rekognition_exception(error_code):
        rekognition_exceptions = {
            "InvalidS3ObjectException": RekognitionInvalidS3ObjectException(),
        }

        return rekognition_exceptions.get(error_code, RekognitionException())

class RekognitionInvalidS3ObjectException(BaseException):
    def __init__(self, message='Não foi encontrado face cadastrada para essa matrícula. Por favor, confira a matrícula ou refaça o cadastro!'):
        super().__init__(message,status_code=404)

