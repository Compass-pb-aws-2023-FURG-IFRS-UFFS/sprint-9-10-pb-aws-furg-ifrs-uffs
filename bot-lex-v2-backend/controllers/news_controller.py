from core.config import settings
from utils import create_response

from services.dynamo import get_all_news
from services.polly import tts_output_directly_on_s3
import traceback

def handle_news_intent(event):
    try:

        # take from the input the number of news to be read
        slots = event['interpretations'][0]['intent']['slots']
        num_news = int(slots['numeroNoticias']['value']['interpretedValue'])

        print(num_news, type(num_news))

        # get formatted news msg
        news = get_news_fmt(num_news=num_news)

        print(traceback.print_exc())

        return create_response(event, news)
    except Exception as e:
        print(traceback.print_exc())
        print(str(e))
        return create_response(event, "Ocorreu um erro!")


def get_news_fmt(num_news=5) -> str:
    """
    get and format news from uffs.edu.br

    :return: msg

    usage example:
    get_news_fmt()
    """

    if num_news <= 0:
        return 'Número de notícias inválido!'

    # scraping from cc.uffs
    news = get_all_news() 

    msg = ''

    for i in range(num_news):
        msg += f'{news[i]["titulo"]}... \n'
        msg += f'Publicada em {news[i]["data"]} \n'
        msg += f'{news[i]["texto"].split("  ler mais...")[0]} \n'
        msg += f'Leia a notícia completa em: {news[i]["link"]} \n'
        msg += f'Ouça a notícia completa em: {news[i]["audio"]} \n\n'

    print(len(msg))

    return msg


def get_news_audio_url(news_text: str, news_id: str) -> str:
    """
    get news content (body) and returns a s3 link with the tts

    :param news_text: news body
    :param news_id: news id
    :return: s3 object link

    usage example:
    get_news_audio_url("A Universidade Federal da Fronteira Sul (UFFS) está com inscrições abertas.", 123)
    """

    bucket_name = settings.NEWS_BUCKET_NAME
    key = settings.NEWS_FOLDER_NAME + f'{news_id}'
    # tts with polly
    audio_url = tts_output_directly_on_s3(news_text, bucket_name, key)
    
    return audio_url