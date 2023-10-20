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