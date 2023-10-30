from controllers.contact_controller import handle_contact_intent

def contact(event):
    return handle_contact_intent(event)