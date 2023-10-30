from bs4 import BeautifulSoup


def extract_student_id_from_html(html):
    soup = BeautifulSoup(html, 'html.parser')

    id_table = soup.find('table', id='identificacao')

    if id_table:
        rows = id_table.find_all('tr')
        matricula = None
        for row in rows:
            cells = row.find_all('td')
            if len(cells) == 4 and "Matrícula" in cells[0].text:
                matricula = cells[1].strong.text.strip()
                break  
        return matricula

    return None  


def extract_classes_info(html):
    soup = BeautifulSoup(html, 'html.parser')
    ccrs = soup.find('table', id='matriculas')
    if ccrs:
        data_list = []
        rows = ccrs.find('tbody').find_all('tr')
        
        for row in rows:
            data_dict = {}
            data_dict['Componentes Curriculares'] = row.find('span', class_='componente').text
            data_dict['Docentes'] = row.find('span', class_='docente').text
            data_dict['Status'] =  status = row.find('td', class_='status').text
            data_dict['Horário'] = horario = row.find('td', class_='horario').text
            data_list.append(data_dict)

    else:
        return None
    return data_list