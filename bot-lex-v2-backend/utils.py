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


def get_news():
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

    string = ''

    for i in range(5):
        string += news_dict['noticias'][i]['titulo'] + '\n'
        string += news_dict['noticias'][i]['data'] + '\n'
        string += news_dict['noticias'][i]['texto'] + '\n'
        string += news_dict['noticias'][i]['link'] + '\n\n'

    return string


def get_news_url(news_text:str, news_id:int) -> str:
  """
  Recebe o texto da notícia e retorna o link para o arquivo de áudio no bucket

  :param news_text: a notícia em formato de texto
  :return: o link para o arquivo de áudio no bucket

  Exemplo de uso:
  read_news("A Universidade Federal da Fronteira Sul (UFFS) está com inscrições abertas.")
  """

  # Set up the S3 client
  s3 = boto3.client('s3')

  # Set up the Polly client
  polly = boto3.client('polly')

  # Set up the S3 bucket name and key
  folder_name = 'news/'
  bucket_name = os.environ['BUCKET_NAME']
  key = folder_name + f'{news_id}.mp3'

  try:
    # Convert the news text to speech using Polly
    response = polly.synthesize_speech(
        Text=news_text,
        Engine='neural',
        OutputFormat='mp3',
        LanguageCode='pt-BR',
        VoiceId='Camila', # Vitoria | Thiago
        TextType='text',
        SampleRate='24000'
      )

    # Save the audio file to the S3 bucket in the folder 'news'
    s3.put_object(
       Body=response['AudioStream'].read(), 
       Bucket=bucket_name, 
       Key=key
      )

    # Get the URL for the audio file in the S3 bucket
    url = s3.generate_presigned_url(
       'get_object', 
       Params={
          'Bucket': bucket_name, 
          'Key': key
          },
        ExpiresIn=3600
        )

    return url

  except (BotoCoreError, ClientError) as error:
    print(error)
    return None
  
