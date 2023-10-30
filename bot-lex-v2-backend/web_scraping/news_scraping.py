from bs4 import BeautifulSoup
import requests

def scrap_all_news_basic_info() -> dict:
    """
    Retorna informacoes sobre todas as noticias do site.
    returns basic info about all news from the site
    (does not returns the full body)

    :return: news dict

    usage example:
    scrap_all_news_basic_info()
    """

    # scrapping news from uffs.edu.br
    url = "https://cc.uffs.edu.br/noticias/"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    noticias = soup.find_all("div", class_="col-12 text-left") # Busca as notícias

    # filters news's text
    news_info = []
    for noticia in noticias:
        news_info.append((noticia.find_all('div', class_='col-9 post-row-content')))

    news_dict = {
        'last_update': '',
        'noticias': []
    }

    # mounts news's dict 
    for i in range(len(news_info[0])):
        news_dict['noticias'].append({
            'id': str(i),
            'titulo': news_info[0][i].a.text,
            'tag': news_info[0][i].span.text,
            'data': news_info[0][i].time.text,
            'texto': news_info[0][i].p.text.split('...')[0] + '...',
            'link': 'https://cc.uffs.edu.br' + news_info[0][i].a['href'],
        })

    return news_dict


def scrap_full_news_by_url(url: str) -> dict:
    """
    receives news url and returns its full body content

    :param url: news url
    :return: its complete body

    usage example:
    get_full_news("https://cc.uffs.edu.br/noticias/curso-de-ciencia-da-computacao-abre-vagas-para-bolsistas/")
    """

    # scrapping full body from cc.uffs
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    news_body_content = soup.find_all('div', class_='post-content mt-5')[0]
        
    news_dict = {'text': ''}
    # mounts news body content dict
    for paragraph in news_body_content:
        if (paragraph is None) or paragraph == '\n':
            continue
        news_dict['text'] += paragraph.text.strip().replace('\n', '. ')
    return news_dict