import boto3

from core.config import settings

s3 = boto3.client('s3')


def save_to_bucket(key, body, bucket):
    s3.put_object(Bucket=bucket, Key=key,Body=body)

def delete_from_bucket(key, bucket):
    s3_client.delete_object(Bucket=bucket, Key=key,)