from utils import create_response
from web_scraping.documents_scraping import scrap_teachers


def handle_contact_intent(event):
    try:
        slots = event['interpretations'][0]['intent']['slots']
        teacher_name = slots.get("Professor", {}).get("value")
        response_message = get_teacher_info(teacher_name)

        return create_response(event, response_message)

    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")


def get_teacher_info(teacher_name):
    slot_teacher = message['interpretedValue']

    contact = scrap_teachers()
    teacher_first_name = slot_teacher.lower()

    if teacher_first_name in contact:
        matching_names = contact[teacher_first_name]
        for full_name, email in matching_names:
            response_message = f'Professor: {full_name}\nEmail: {email}\n'
    else:
        response_message = 'Infelizmente não encontrei, verifique se o nome está correto.'
    
    return response_message