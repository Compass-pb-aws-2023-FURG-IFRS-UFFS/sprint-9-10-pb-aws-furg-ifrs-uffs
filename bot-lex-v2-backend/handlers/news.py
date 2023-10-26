from utils import create_response, get_news

def handle_news_intent(event, context):
    try:
        news = get_news()
        return create_response(event, news)
    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")
