import boto3
from config import settings
from utils import get_formatted_datetime
s3_client = boto3.client('s3')

def save_to_bucket(image, bucket=settings.BUCKET_NAME):
    s3 = boto3.client('s3')
    object_key = f'face-recognized-{get_formatted_datetime()}.jpeg'
    s3.put_object(Bucket = bucket, Key = f'liveness/{object_key}',Body=image)
    return object_key
