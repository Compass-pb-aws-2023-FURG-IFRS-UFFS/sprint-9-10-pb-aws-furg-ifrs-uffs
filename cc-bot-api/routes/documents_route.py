from controllers.documents_controller import documents
import json


def documents_route(event, context):
    documents_json = json.dumps(documents())
    return documents_json