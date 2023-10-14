from datetime import datetime
import pytz


def create_response(event, msgText):
  response = {
          "sessionState": {
            "dialogAction": {
              "type": "Close"
            },
            "intent": {
              "name": event['sessionState']['intent']['name'],
              "slots": event['sessionState']['intent']['slots'],
              "state": "Fulfilled"
            }
          },
          "messages": [
            {
              "contentType": "PlainText",
              "content": msgText
            }
            ]
        }
      
  return response


def get_formatted_datetime():
    """
     Returns date and time in human readable format.
     @return A string of the form YYYY - MM - DD HH : MM :
    """
    brazil_timezone = pytz.timezone('America/Sao_Paulo')
    return datetime.now(brazil_timezone).strftime("%d/%m/%y %H:%M:%S")