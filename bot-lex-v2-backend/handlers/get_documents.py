from bs4 import BeautifulSoup
import requests
from utils import create_response
import json


def handle_get_documents_intent(event, context):
    try:
        print(event)
        slots = event['interpretations'][0]['intent']['slots']
        document_name = slots['DocumentType']['value']['interpretedValue']

        documents = json.loads(get_documents(document_name))

        document_name_links = "\n".join([
            f"{document['documento']}: {document['link']}" for document in documents])

        return create_response(event, str(document_name_links))

    except Exception as e:
        print(str(e))
        return create_response(event, "Ocorreu um erro! getdocuments")


def get_documents(document_name):
    """ Retorna os documentos do site do curso de Ciência da Computação que contêm o texto especificado.

    :param document_name: O texto a ser procurado nos documentos
    :return: Python dictionary with documents that contain the text

    Exemplo de uso:
    get_documents("Documento 1")
    """
    document_name = document_name.lower()
    url = "https://www.uffs.edu.br/campi/chapeco/cursos/graduacao/ciencia-da-computacao/documentos"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    tables = soup.find_all("table", class_="listing")
    data_list = []

    for table in tables:
        for row in table.find_all('tr')[1:]:  # Skip the first row (header)
            first_cell = row.find('td')
            link = first_cell.find('a')

            if link:
                href = link.get('href')
                cell_content = first_cell.get_text(strip=True).lower()

                if document_name in cell_content:
                    data_dict = {
                        "documento": cell_content.upper(),
                        "link": href + "/@@download/documento_historico"
                    }
                    data_list.append(data_dict)

    return json.dumps(data_list, ensure_ascii=False)
