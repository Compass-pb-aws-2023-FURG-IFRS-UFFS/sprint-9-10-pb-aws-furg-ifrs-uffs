# dessa forma todos os arquivos sao carregados quando chamamos a router
# ha espaco para melhora aqui !!
from handlers.contact_us import contact_us
from handlers.contact import contact
from handlers.documents import documents
from handlers.news import news
from handlers.ru_menu import ru_menu

def handle_router(event, context):
    intent_name = event['sessionState']['intent']['name']

    intent_handlers = {
        "ContactUsIntent": contact_us,
        "GetContactIntent": contact,
        "GetDocumentsIntent": documents,
        "GetNewsIntent": news,
        "GetRUMenu": ru_menu,
    }
    
    if intent_name in intent_handlers:
        print(f"Intent: {intent_name} -> Is being executed")
        return intent_handlers[intent_name](event)
        
    raise Exception('No handler for intent: ' + intent_name)