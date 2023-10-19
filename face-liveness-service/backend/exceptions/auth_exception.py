from .base_exception import BaseException

class AuthException(BaseException):
    def __init__(self, status_code=500, message="Algo deu errado no serviço de autenticação"):
        super().__init__(message, status_code)