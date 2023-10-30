from utils import create_response, date_to_weekday_ymd
from web_scraping.contact_scraping import scrap_teachers
import requests


def handle_ru_menu_intent(event):
    try:
        slots = event['interpretations'][0]['intent']['slots']
        date = slots['Date']['value']['interpretedValue']
        weekday = date_to_weekday_ymd(date)
        campus = 'chapeco'

        api_link = f"https://ru-uffs-api.mascdriver.com.br/campus/{campus}/dia/{weekday}"
        response = requests.get(api_link).json()

        response = response['cardapios'][0]
        menu = f"""
                \tCardápio de {campus} 🏫\n
                🗓️ {response['dia']}
                🥗 {response['salada']}
                🥗 {response['salada1']}
                🥗 {response['salada2']}
                🍚 {response['graos']}
                🍙 {response['graos1']}
                🍟 {response['acompanhamento']}
                🥩 {response['mistura']}
                🥦 {response['mistura_vegana']}
                🍩 {response['sobremesa']}
                """
        return create_response(event, menu)

    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro na obtenção do cardápio!")