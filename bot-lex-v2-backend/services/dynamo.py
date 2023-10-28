import boto3

from core.config import settings
dynamodb = boto3.resource('dynamodb')


def put_news(data: dict) -> bool:
    """
    Salva as notícias no DynamoDB

    :param data: json contendo array de notícias
    :return: True se as notícias foram salvas, False caso contrário

    Exemplo de uso:
    put_news(data)
    """
    try:
        table = dynamodb.Table(settings.NEWS_TABLE_NAME) # Instancia a tabela
        
        # Salva as notícias no DynamoDB
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
        print(str(e)) # Printa o erro no CloudWatch
        return False


def get_all_news() -> dict:
    """
    Retorna todas as notícias do site do curso de Ciência da Computação

    :return: Dicionário com as notícias

    Exemplo de uso:
    get_all_news()
    """
    table = dynamodb.Table(settings.NEWS_TABLE_NAME) # Instancia a tabela

    response = table.scan() # Faz a consulta na tabela

    response['Items'].sort(key=lambda x: int(x['id'])) # Ordena as notícias pelo id
    return response['Items']