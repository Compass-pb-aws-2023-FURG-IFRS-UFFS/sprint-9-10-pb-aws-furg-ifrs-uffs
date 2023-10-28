from controllers.news_controller import handle_news_intent

def news(event, context):
    return handle_news_intent(event)