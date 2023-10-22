import json

def create_response(statusCode, body=''):

    return {
        'statusCode': statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json; charset=utf-8",

        },
        'body': json.dumps(body)
    }
