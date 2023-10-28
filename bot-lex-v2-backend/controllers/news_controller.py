import boto3
from botocore.exceptions import BotoCoreError, ClientError

from core.config import settings
from services.dynamo import get_all_news
from utils import create_response


def handle_news_intent(event):
    try:
        news = get_news_fmt()
        return create_response(event, news)
    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")


def get_news_fmt() -> str:
    """
    retorna 5 noticiais mais recentes formatadas para mensagem 

    :param news: as notícias
    :return: as notícias formatadas

    Exemplo de uso:
    get_news_fmt()
    """

    news = get_all_news() 

    # Monta a mensagem com as notícias
    msg = ''
    for i in range(5):
        msg += f'{news[i]["titulo"]}... \n'
        msg += f'Publicada em {news[i]["data"]} \n'
        msg += f'{news[i]["texto"].split("  ler mais...")[0]} \n'
        msg += f'Leia a notícia completa em: {news[i]["link"]} \n'
        msg += f'Ouça a notícia completa em: {news[i]["audio"]} \n\n'

    return msg


def get_news_url(news_text: str, news_id: int) -> str:
    """
    Recebe o texto da notícia e retorna o link para o arquivo de áudio no bucket

    :param news_text: a notícia em formato de texto
    :param news_id: identificador único da notícia
    :return: o link para o arquivo de áudio no bucket

    Exemplo de uso:
    get_news_url("A Universidade Federal da Fronteira Sul (UFFS) está com inscrições abertas.", 123)
    """

    s3 = boto3.client('s3') # Instancia o cliente S3

    polly = boto3.client('polly') # Instancia o cliente Polly

    folder_name = settings.NEWS_FOLDER_NAME
    bucket_name = settings.NEWS_BUCKET_NAME
    key = folder_name + f'{news_id}' # Nome do arquivo no bucket

    try:
        # Converte o texto da notícia em áudio
        response = polly.start_speech_synthesis_task(
            Text=news_text,
            Engine='neural',
            OutputS3BucketName=f'{bucket_name}',
            OutputS3KeyPrefix=key,
            LanguageCode='pt-BR',
            OutputFormat='mp3',
            VoiceId='Camila',  # Vitoria | Thiago
            SampleRate='24000',
            TextType='text'
        )
        
        # Monta a url do arquivo de áudio
        url = f"https://{bucket_name}.s3.amazonaws.com/{key}.{response['SynthesisTask']['TaskId']}.mp3"
        return url

    # Caso ocorra algum erro, retorna None
    except (BotoCoreError, ClientError) as error:
        print(error) # Printa o erro no CloudWatch
        return None