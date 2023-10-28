from controllers.contact_controller import handle_contact_intent

def contact(event, context):
    return handle_contact_intent(event)