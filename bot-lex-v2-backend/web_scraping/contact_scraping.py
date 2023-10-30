import requests
from bs4 import BeautifulSoup


def scrap_teachers():
    url = 'https://cc.uffs.edu.br/pessoas/'
    
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    teachers = soup.find_all("div", class_="row text-left")
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