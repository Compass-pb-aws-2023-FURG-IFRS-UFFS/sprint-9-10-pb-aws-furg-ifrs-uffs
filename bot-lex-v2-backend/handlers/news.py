from controllers.news_controller import handle_news_intent, get_news_audio_url
from web_scraping.news_scraping import scrap_all_news_basic_info, scrap_full_news_by_url
from services.dynamo import put_news, get_news_by_id, update_news
from utils import create_hash

def news(event):
    return handle_news_intent(event)

def store_news(event, context):
    news_basic_info = scrap_all_news_basic_info().get('noticias')
    for news in news_basic_info:
        title = news.get('titulo')
        url = news.get('link')
        news_full_info = scrap_full_news_by_url(url)
        news_text = news_full_info.get('text')
        title_hash = create_hash(title + news_text)
        existing_news = get_news_by_id(title_hash)
        if existing_news and existing_news.get('texto_completo') == news_text:
           continue
        audio_url = get_news_audio_url(news_full_info.get('text'), title_hash)
        news['texto_completo'] = news_text
        news['audio'] = audio_url
        if not existing_news:
            put_news(news)
        elif existing_news.get('texto_completo') != news_text:
            update_news(news)
    



