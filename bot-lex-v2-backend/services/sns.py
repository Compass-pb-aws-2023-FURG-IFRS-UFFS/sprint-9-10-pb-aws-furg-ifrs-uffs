import boto3

from core.config import settings
from utils import get_formatted_datetime
sns = boto3.client('sns')

def dispatch_to_devs(message, topic = settings.SNS_TOPIC_ARN):
    subject = 'Relato de usuário de CCUFFS BOT'
    message += '\n' + f'Essa mensagem foi encaminhada em: {str(get_formatted_datetime())}'
    
    sns.publish(TopicArn=topic,Message=message,Subject=subject)