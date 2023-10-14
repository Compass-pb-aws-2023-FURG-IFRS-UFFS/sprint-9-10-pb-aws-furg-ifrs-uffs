import os

class Settings:
    SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')
    
settings = Settings()
