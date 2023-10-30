import boto3

from core.config import settings
dynamodb = boto3.resource('dynamodb')


def put_news(data: dict) -> bool:
    """
    save news on dynamo

    :param data: python dict
    :return: true if dynamo persists news info. false otherwise

    usage example:
    put_news(data)
    """
    try:
        table = dynamodb.Table(settings.NEWS_TABLE_NAME)
        
        for news in data['noticias']:
            response = table.put_item(
                Item={
                    'id': news['id'],
                    'titulo': news['titulo'],
                    'tag': news['tag'],
                    'data': news['data'],
                    'texto': news['texto'],
                    'link': news['link'],
                    'audio': news['audio']
                }
            )
        return True
    except Exception as e:
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


def get_schedule_from_student(student_id):
    table = dynamodb.Table(settings.DYNAMO_DB_USERS_TABLE)

    student = table.get_item(Key = {'id':student_id})
    student =  student.get('Item', {})
    
    if not student:
        return False
    return student.get('schedule', False)