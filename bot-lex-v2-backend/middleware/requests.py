import json
import os
import urllib.request

def send_message_telegram(chat_id, text, parse_mode='HTML'):
    return send_request_telegram("sendMessage", {"chat_id": chat_id, "text": text, "parse_mode": parse_mode})

def send_request_telegram(telegram_method, data):
    telegramURL = f"https://api.telegram.org/bot{os.environ['TELEGRAM_TOKEN']}/{telegram_method}"
    request = urllib.request.Request(
        telegramURL,
        method="POST",
        data=json.dumps(data).encode(),
        headers={'content-type': 'application/json'}
    )
    response = urllib.request.urlopen(request)
    return response

def get_file_details_telegram(file_id):
    raw_res = send_request_telegram("getFile", {"file_id": file_id})
    text_res = raw_res.read().decode('utf-8')
    json_res = json.loads(text_res)
    return json_res["result"]

def get_file_telegram(file_path):
    telegramURL = f"https://api.telegram.org/file/bot{os.environ['TELEGRAM_TOKEN']}/{file_path}"
    print(telegramURL)
    req = urllib.request.Request(telegramURL, method="GET")
    raw_res = urllib.request.urlopen(req)
    print(raw_res.__dict__)
    bin_file = raw_res.read()
    return bin_file