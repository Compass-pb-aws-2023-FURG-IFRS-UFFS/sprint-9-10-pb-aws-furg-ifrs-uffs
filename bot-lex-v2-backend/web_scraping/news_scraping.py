from bs4 import BeautifulSoup
import requests

def scrap_all_news_basic_info() -> dict:
    """
    Retorna informacoes sobre todas as noticias do site.
    Nao retorna o corpo completo da noticia

    :return: Dicionário com as notícias

    Exemplo de uso:
    scrap_news()
    """

    url = "https://cc.uffs.edu.br/noticias/"
    response = requests.get(url)

    soup = BeautifulSoup(response.content, "html.parser") # Instancia o BeautifulSoup

    noticias = soup.find_all("div", class_="col-12 text-left") # Busca as notícias

    # Busca os textos das notícias
    textos = []
    for noticia in noticias:
        textos.append((noticia.find_all('div', class_='col-9 post-row-content')))

    news_dict = {
        'last_update': '',
        'noticias': []
    }

    # Monta o dicionário com as notícias
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


def scrap_full_news_by_url(url: str) -> dict:
    """
    Recebe a url da notícia e retorna o texto completo

    :param url: a url da notícia
    :return: o texto completo da notícia

    Exemplo de uso:
    get_full_news("https://cc.uffs.edu.br/noticias/curso-de-ciencia-da-computacao-abre-vagas-para-bolsistas/")
    """

    response = requests.get(url) # Faz a requisição da página
    
    soup = BeautifulSoup(response.content, 'html.parser') # Instancia o BeautifulSoup
    
    content = soup.find_all('div', class_='post-content mt-5')[0] # Busca o conteúdo da notícia
        
    news_dict = {'text': ''}
    
    # Monta o dicionário com o texto completo da notícia
    for p in content:
        news_dict['text'] += p.text.strip().replace('\n', ' ')
        
    return news_dict