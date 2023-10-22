import os

class Settings:
    SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN')
    CC_API_BASE_URL = os.environ.get('CC_API_BASE_URL')
    
settings = Settings()
