from botocore.exceptions import BotoCoreError, ClientError
from bs4 import BeautifulSoup
from datetime import datetime
import requests
import boto3
import pytz
import json
import os


def create_response(event, msgText):
  response = {
          "sessionState": {
            "dialogAction": {
              "type": "Close"
            },
            "intent": {
              "name": event['sessionState']['intent']['name'],
              "slots": event['sessionState']['intent']['slots'],
              "state": "Fulfilled"
            }
          },
          "messages": [
            {
              "contentType": "PlainText",
              "content": msgText
            }
            ]
        }
      
  return response


def get_formatted_datetime():
    brazil_timezone = pytz.timezone('America/Sao_Paulo')
    return datetime.now(brazil_timezone).strftime("%d/%m/%y %H:%M:%S")


def parse_event_body(event, required_params=None):

    if event.get("body") == None:
        raise Exception("Invalid input: Missing body")
    
    body = json.loads(event["body"]) if type(event["body"]) is not dict else event["body"]

    if required_params:
        for required_param in required_params:
            if body.get(required_param) == None:
                raise Exception(f"Invalid input: Missing {required_param} param")
    
    return body

url = 'https://cc.uffs.edu.br/pessoas/'
response = requests.get(url)
print('Esse é o print do URL: ', url)
soup = BeautifulSoup(response.content, "html.parser")
teachers = soup.find_all("div", class_="row text-left")


def get_teachers():
    names = []
    emails = []
    for teacher in teachers:
        name = teacher.find_all('span', class_='font-semibold text-lg text-white block')
        email = teacher.find_all('span', class_='px-2 text-xs font-medium')
        names.append(name)
        emails.append(email)

    name_dict = {}
    for teacher, email in zip(names[0], emails[0]):
        full_name = teacher.text
        first_name = full_name.split()[0].lower()
        if first_name not in name_dict:
            name_dict[first_name] = []

        name_dict[first_name].append((full_name, email.text))
    
    return name_dict


def get_name(message):
    slot_teacher = message['interpretedValue']
    contact = get_teachers()
    user_first_name = slot_teacher.lower()

    if user_first_name in contact:
        matching_names = contact[user_first_name]
        for full_name, email in matching_names:
            response_message = f'Professor: {full_name}\nEmail: {email}\n'
    else:
        response_message = 'Infelizmente não encontrei, verifique se o nome está correto.'
    
    return response_message


# NEWS SECTION


def get_news_from_dynamo() -> dict:
    """
    Retorna as notícias do site do curso de Ciência da Computação

    :return: Dicionário com as notícias

    Exemplo de uso:
    get_news_from_dynamo()
    """

    dynamodb = boto3.resource('dynamodb') # Instancia o recurso DynamoDB

    table_name = os.environ['NEWS_TABLE_NAME'] # Nome da tabela
    
    table = dynamodb.Table(table_name) # Instancia a tabela

    response = table.scan() # Faz a consulta na tabela

    response['Items'].sort(key=lambda x: int(x['id'])) # Ordena as notícias pelo id
    
    return response['Items']


def formated_news() -> str:
    """
    Formata as notícias para o formato de texto para serem enviadas ao usuário

    :param news: as notícias
    :return: as notícias formatadas

    Exemplo de uso:
    format_news(news)
    """

    news = get_news_from_dynamo() # Busca as notícias no DynamoDB

    string = ''
    
    # Monta a string com as notícias
    for i in range(5):
        string += news[i]['titulo'] + '\n'
        string += 'Publicada em: ' + news[i]['data'] + '\n'
        string += news[i]['texto'] + '\n'
        string += 'Leia a notícia completa em: ' + news[i]['link'] + '\n'
        string += 'Ouça a notícia completa em: ' + news[i]['audio'] + '\n\n'

    return string


def get_news() -> dict:
    """
    Retorna as notícias do site do curso de Ciência da Computação

    :return: Dicionário com as notícias

    Exemplo de uso:
    get_news()
    """

    url = "https://cc.uffs.edu.br/noticias/"
    response = requests.get(url)

    soup = BeautifulSoup(response.content, "html.parser") # Instancia o BeautifulSoup

    noticias = soup.find_all("div", class_="col-12 text-left") # Busca as notícias

    textos = []

    # Busca os textos das notícias
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


def get_full_news(url: str) -> dict:
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


def get_news_url(news_text: str, news_id: int) -> str:
    """
    Recebe o texto da notícia e retorna o link para o arquivo de áudio no bucket

    :param news_text: a notícia em formato de texto
    :param news_id: identificador único da notícia
    :return: o link para o arquivo de áudio no bucket

    Exemplo de uso:
    get_news_url("A Universidade Federal da Fronteira Sul (UFFS) está com inscrições abertas.", 123)
    """

    s3 = boto3.client('s3') # Instancia o cliente S3

    polly = boto3.client('polly') # Instancia o cliente Polly

    folder_name = os.environ['FOLDER_NAME'] + '/' # Nome da pasta no bucket
    bucket_name = os.environ['BUCKET_NAME'] # Nome do bucket
    key = folder_name + f'{news_id}' # Nome do arquivo no bucket

    try:
        # Converte o texto da notícia em áudio
        response = polly.start_speech_synthesis_task(
            Text=news_text,
            Engine='neural',
            OutputS3BucketName=f'{bucket_name}',
            OutputS3KeyPrefix=key,
            LanguageCode='pt-BR',
            OutputFormat='mp3',
            VoiceId='Camila',  # Vitoria | Thiago
            SampleRate='24000',
            TextType='text'
        )
        
        # Monta a url do arquivo de áudio
        url = f"https://{bucket_name}.s3.amazonaws.com/{key}.{response['SynthesisTask']['TaskId']}.mp3"
        return url

    # Caso ocorra algum erro, retorna None
    except (BotoCoreError, ClientError) as error:
        print(error) # Printa o erro no CloudWatch
        return None
  

def save_to_dynamo(noticias: dict) -> bool:
    """
    Salva as notícias no DynamoDB

    :param noticias: as notícias
    :return: True se as notícias foram salvas, False caso contrário

    Exemplo de uso:
    save_to_dynamo(noticias)
    """

    try:
        dynamodb = boto3.resource('dynamodb') # Instancia o recurso DynamoDB

        table_name = os.environ['NEWS_TABLE_NAME'] # Nome da tabela
        
        table = dynamodb.Table(table_name) # Instancia a tabela
        
        # Salva as notícias no DynamoDB
        for noticia in noticias['noticias']:
            response = table.put_item(
                Item={
                    'id': noticia['id'],
                    'titulo': noticia['titulo'],
                    'tag': noticia['tag'],
                    'data': noticia['data'],
                    'texto': noticia['texto'],
                    'link': noticia['link'],
                    'audio': noticia['audio']
                }
            )

        return True
    
    # Caso ocorra algum erro, retorna False
    except Exception as e:
        print(str(e)) # Printa o erro no CloudWatch
        return False