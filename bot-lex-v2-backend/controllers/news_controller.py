from core.config import settings
from utils import create_response

from services.dynamo import get_all_news
from services.polly import tts_output_directly_on_s3

def handle_news_intent(event):
    try:
        # get formatted news msg
        news = get_news_fmt()

        return create_response(event, news)
    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")


def get_news_fmt() -> str:
    """
    get and format 5 most recent news from source cc.uffs

    :return: msg

    usage example:
    get_news_fmt()
    """

    # scraping from cc.uffs
    news = get_all_news() 

    msg = ''
    for i in range(5):
        msg += f'{news[i]["titulo"]}... \n'
        msg += f'Publicada em {news[i]["data"]} \n'
        msg += f'{news[i]["texto"].split("  ler mais...")[0]} \n'
        msg += f'Leia a notícia completa em: {news[i]["link"]} \n'
        msg += f'Ouça a notícia completa em: {news[i]["audio"]} \n\n'

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