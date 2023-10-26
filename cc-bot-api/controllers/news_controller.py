from bs4 import BeautifulSoup
import requests

def news():
    """
    Retorna as notícias do site do curso de Ciência da Computação

    :return: Dicionário com as notícias

    Exemplo de uso:
    news()
    """

    url = "https://cc.uffs.edu.br/noticias/"
    response = requests.get(url)

    soup = BeautifulSoup(response.content, "html.parser")

    noticias = soup.find_all("div", class_="col-12 text-left")

    textos = []

    for noticia in noticias:
        textos.append((noticia.find_all('div', class_='col-9 post-row-content')))

    news_dict = {
        'last_update': '',
        'noticias': []
    }

    for i in range(len(textos[0])):
        news_dict['noticias'].append({
            'id': str(i),
            'titulo': textos[0][i].a.text,
            'tag': textos[0][i].span.text,
            'data': textos[0][i].time.text,
            'texto': textos[0][i].p.text.split('...')[0] + '...',
            'link': 'https://cc.uffs.edu.br' + textos[0][i].a['href'],
        })

    return news_dict