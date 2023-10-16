from controllers.news_controller import news
import json

def news_route(event, context):
    news_json = json.dumps(news())
    return news_json