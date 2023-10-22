import os

class Settings:
    MSG = os.environ.get('MSG')
    DYNAMODB_USERS_TABLE = os.environ.get('DYNAMO_DB_USERS_TABLE')

settings = Settings()
