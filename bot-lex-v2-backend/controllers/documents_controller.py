import json

from utils import create_response
from web_scraping.documents_scraping import scrap_documents 

def handle_documents_intent(event):
    try:
        slots = event['interpretations'][0]['intent']['slots']
        document_name = slots['DocumentType']['value']['interpretedValue']

        documents = json.loads(scrap_documents(document_name))

        document_name_links = "\n".join([
            f"{document['documento']}: {document['link']}" for document in documents])

        return create_response(event, str(document_name_links))

    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")