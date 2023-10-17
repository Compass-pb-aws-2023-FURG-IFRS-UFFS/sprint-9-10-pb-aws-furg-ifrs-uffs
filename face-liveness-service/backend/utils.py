import json
from datetime import datetime
import pytz

def create_response(statusCode, body=''):
    """
     Create a response with the given status code and body
     
     @param statusCode - The status code to return
     @param body - The body of the response. Defaults to a blank string
     
     @return A dictionary that can be sent as response
    """
    return {
        'statusCode': statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        'body': json.dumps(body)
    }


def get_formatted_datetime():
    """
     Returns date and time in human readable format.
     @return A string of the form YYYY - MM - DD HH : MM :
    """
    brazil_timezone = pytz.timezone('America/Sao_Paulo')
    return datetime.now(brazil_timezone).strftime("%d-%m-%y %H:%M:%S")