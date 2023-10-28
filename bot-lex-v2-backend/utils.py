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

