import os

class Settings:
    SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')
    CC_API_BASE_URL = os.environ.get('CC_API_BASE_URL')
    SIGN_IN_LAMBDA = os.environ.get('SIGN_IN_LAMBDA')
    AUTH_API_URL = os.environ.get('AUTH_API_URL')
    DYNAMO_DB_USERS_TABLE= os.environ.get('DYNAMO_DB_USERS_TABLE')
    LEX_BOT_ID = os.environ.get('LEX_BOT_ID')
    LEX_ALIAS_ID = os.environ.get('LEX_ALIAS_ID')
    
    NEWS_FOLDER_NAME = os.environ.get('NEWS_FOLDER_NAME')
    NEWS_BUCKET_NAME = os.environ.get('NEWS_BUCKET_NAME')
    NEWS_TABLE_NAME = os.environ.get('NEWS_TABLE_NAME')

settings = Settings()
