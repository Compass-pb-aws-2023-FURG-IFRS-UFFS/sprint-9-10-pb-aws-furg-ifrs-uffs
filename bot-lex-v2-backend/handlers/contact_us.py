from controllers.contact_us_controller import handle_contact_us_intent

def contact_us(event, context):
    return handle_contact_us_intent(event)