from utils import create_response, formated_news

def handle_news_intent(event, context):
    try:
        news = formated_news()
        return create_response(event, news)
    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")
