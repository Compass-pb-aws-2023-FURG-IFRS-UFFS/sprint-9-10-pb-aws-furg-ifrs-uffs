import os

class Settings:
    BUCKET_NAME = os.environ.get('BUCKET_NAME')
    DYNAMODB_USERS_TABLE = os.environ.get('DYNAMO_DB_USERS_TABLE')
    BOT_BACKEND_API_URL = os.environ.get('BOT_BACKEND_API_URL')

settings = Settings()