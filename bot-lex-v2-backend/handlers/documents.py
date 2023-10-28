from controllers.documents_controller import handle_documents_intent

def documents(event):
    return handle_documents_intent(event)