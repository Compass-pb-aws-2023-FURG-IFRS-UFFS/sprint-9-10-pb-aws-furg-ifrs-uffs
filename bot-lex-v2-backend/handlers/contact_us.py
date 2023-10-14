from core.config import settings
import json
from utils import create_response, get_formatted_datetime
import boto3

def handle_contact_us_intent(event, context):
    try:
        slots = event['interpretations'][0]['intent']['slots']
        message = slots['message']['value']['interpretedValue']
        publish_message(message)
        return create_response(event, 'A mensagem foi encaminhada para os desenvolvedores!')
    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")
    
def publish_message(message, topic = settings.SNS_TOPIC_ARN):
    sns = boto3.client('sns')
    subject = 'Relato de usuário de CCUFFS BOT'
    message += '\n' + f'Essa mensagem foi encaminhada em: {str(get_formatted_datetime())}'
    sns.publish(TopicArn=topic,Message=message,Subject=subject)
    
