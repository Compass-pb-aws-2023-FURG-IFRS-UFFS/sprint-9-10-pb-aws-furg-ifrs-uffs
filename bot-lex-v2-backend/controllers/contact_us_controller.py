import json

from utils import create_response
from services.sns import dispatch_to_devs

def handle_contact_us_intent(event):
    try:
        slots = event['interpretations'][0]['intent']['slots']
        message = slots['message']['value']['interpretedValue']
        
        # send message to devs by email (sns service)
        dispatch_to_devs(message)

        return create_response(event, 'A mensagem foi encaminhada para os desenvolvedores!')
    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")