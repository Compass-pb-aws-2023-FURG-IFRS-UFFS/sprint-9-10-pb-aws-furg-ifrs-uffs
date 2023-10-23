from bs4 import BeautifulSoup
import requests
import json


def documents():
    """ Retorna os documentos do site do curso de Ciência da Computação

    :return: JSON

    Exemplo de uso:
    documents()
    """

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
                cell_content = first_cell.get_text(strip=True)

                json = {
                    "documento": cell_content,
                    "link": href
                }

                data_list.append(json)

    return data_list
