import os

class Settings:
    SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')
    CC_API_BASE_URL = os.environ.get('CC_API_BASE_URL')
    SIGN_IN_LAMBDA = os.environ.get('SIGN_IN_LAMBDA')
    AUTH_API_URL = os.environ.get('AUTH_API_URL')
    DYNAMO_DB_USERS_TABLE= os.environ.get('DYNAMO_DB_USERS_TABLE')
    
settings = Settings()
