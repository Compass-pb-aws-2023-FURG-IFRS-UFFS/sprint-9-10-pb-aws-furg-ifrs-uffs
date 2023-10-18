import os

class Settings:
    BUCKET_NAME = os.environ.get('BUCKET_NAME')
    DYNAMODB_USERS_TABLE = os.environ.get('DYNAMO_DB_USERS_TABLE')

settings = Settings()