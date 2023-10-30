import boto3
import traceback
from core.config import settings
from utils import create_hash
dynamodb = boto3.resource('dynamodb')


def put_news(news: dict) -> bool:
    """
    save news on dynamo

    :param data: python dict
    :return: true if dynamo persists news info. false otherwise

    usage example:
    put_news(data)
    """
    try:
        table = dynamodb.Table(settings.NEWS_TABLE_NAME)
        
        response = table.put_item(
            Item={
                'id': create_hash(news['titulo'] + news['texto_completo']),
                'titulo': news['titulo'],
                'tag': news['tag'],
                'data_post': news['data'],
                'texto': news['texto'],
                'link': news['link'],
                'audio': news['audio'],
                'texto_completo': news['texto_completo']
            }
        )
        return True
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return False

def update_news(news: dict) -> bool:
    """
    Update news data in DynamoDB

    :param news: Python dict containing news data
    :return: True if the update is successful, False otherwise
    """
    dynamodb = boto3.resource('dynamodb')

    try:
        table = dynamodb.Table(settings.NEWS_TABLE_NAME)

        response = table.update_item(
            Key={'id': create_hash(news['titulo'] + news['texto_completo'])},
            UpdateExpression="set titulo = :t, tag = :tg, data_post = :d, texto = :txt, link = :l, audio = :a, texto_completo = :tc",
            ExpressionAttributeValues={
                ':t': news['titulo'],
                ':tg': news['tag'],
                ':d': news['data'],
                ':txt': news['texto'],
                ':l': news['link'],
                ':a': news['audio'],
                ':tc': news['texto_completo']
            }
        )
        return True
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        return False

def get_all_news() -> dict:
    """
    returns all news from cc.uffs as dict

    :return: news dict

    usage example
    get_all_news()
    """
    table = dynamodb.Table(settings.NEWS_TABLE_NAME)

    response = table.scan()
    response['Items'].sort(key=lambda x: int(x['id']))

    return response['Items']

def get_news_by_id(id):
    table = dynamodb.Table(settings.NEWS_TABLE_NAME)
    
    news = table.get_item(Key = {'id':id})
    
    return news.get('Item', None)


def get_schedule_from_student(student_id):
    table = dynamodb.Table(settings.DYNAMO_DB_USERS_TABLE)

    student = table.get_item(Key = {'id':student_id})
    student =  student.get('Item', {})
    
    if not student:
        return False
    return student.get('schedule', False)


def get_student_from_id(student_id):
    table = dynamodb.Table(settings.DYNAMO_DB_USERS_TABLE)
    
    student = table.get_item(Key = {'id':student_id})
    
    return student.get('Item', None)


def update_student(student_id, schedule):
    table = dynamodb.Table(settings.DYNAMO_DB_USERS_TABLE)

    update_expression = "SET #schedule = :newSchedule"
    expression_attribute_values = {
        ':newSchedule': schedule
    }
    expression_attribute_names = {
        '#schedule': 'schedule',
    }

    response = table.update_item(
        Key={'id': student_id},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values,
        ExpressionAttributeNames=expression_attribute_names,
    )

    return True