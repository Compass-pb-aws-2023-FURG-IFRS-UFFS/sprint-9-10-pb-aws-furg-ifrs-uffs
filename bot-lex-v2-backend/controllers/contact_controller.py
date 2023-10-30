from utils import create_response
from web_scraping.contact_scraping import scrap_teachers


def handle_contact_intent(event):
    try:
        slots = event['interpretations'][0]['intent']['slots']
        teacher_name = slots.get("Teachers", {}).get("value")

        response_message = get_teacher_info(teacher_name)

        return create_response(event, response_message)

    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro!")


def get_teacher_info(teacher_name):
    slot_teacher = teacher_name['interpretedValue']

    # scraping from cc.uffs
    contacts = scrap_teachers()

    teacher_first_name = slot_teacher.lower()
    if teacher_first_name in contacts:
        response_message = f'Professor: {contacts[teacher_first_name][0][0]}\nEmail: {contacts[teacher_first_name][0][1]}\n\n'
    else: 
        response_message = 'Infelizmente não encontrei, verifique se o nome está correto.'

    return response_message