import json
from services.dynamodb_service import select_all
from services.bucket_service import delete_from_bucket, list_objects

def handler(event,context):
    items = select_all().get('Items', {})
    if items:
        valid_keys = [student['image_key'] for student in items if student.get('image_key')]
    for s3_object in list_objects():
        s3_key = s3_object.get('Key')
        if s3_key not in valid_keys:
            delete_from_bucket(s3_key)
            print(f'{s3_key} deleted!')