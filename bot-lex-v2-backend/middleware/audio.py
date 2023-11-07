import boto3
import json
import time
import urllib.request
from core.config import settings
from middleware.requests import get_file_details_telegram, get_file_telegram, send_message_telegram

def handle_audio(chat_id, voice_file_id):

 
    file_details = get_file_details_telegram(voice_file_id)
    print("File details from telegram: ", file_details)

    if not file_details or not file_details.get("file_size") or file_details["file_size"] >= 300000/4:
        send_message_telegram(chat_id, "Seu áudio é muito grande para ser processado")
        send_message_telegram(chat_id, "Recomendo áudios de no máximo 15 segundos de duração")
        return False
    
    send_message_telegram(chat_id, "Estou processando o seu audio. A conversão pode levar de alguns segundos.")

    bin_file = get_file_telegram(file_details["file_path"])

    print("Sending voice file to s3")
    s3_client = boto3.client('s3')
    file_key =f'transcript/{file_details["file_path"]}'
    s3_client.put_object(
        Body=bin_file,
        Bucket=settings.NEWS_BUCKET_NAME,
        Key=file_key,
    )

    print("Starting voice transcription")
    transcribe_client = boto3.client("transcribe")
    job_name = f"bot_transcription{file_details['file_path'].replace('/','_')}"
    transcribe_client.start_transcription_job(
        TranscriptionJobName=job_name,
        LanguageCode="pt-BR",
        MediaFormat="ogg",
        Media={"MediaFileUri": f"s3://{settings.NEWS_BUCKET_NAME}/{file_key}"})

    transcribe_text = ""
    for i in range(0, 15):
        time.sleep(2)
        job = transcribe_client.get_transcription_job(TranscriptionJobName=job_name)
        job_status = job["TranscriptionJob"]["TranscriptionJobStatus"]

        if job_status == "COMPLETED":
            raw_response = urllib.request.urlopen(job["TranscriptionJob"]["Transcript"]["TranscriptFileUri"])
            json_data = json.loads(raw_response.read())
            transcribe_text = json_data["results"]["transcripts"][0]["transcript"]
            print(f"Iteration {i}: Completed: {transcribe_text}")
            break

        elif job_status == "FAILED":
            print(f"Iteration {i}: Failed")
            transcribe_text = False
            break

        else:
            print(f"Iteration {i}: Pending")

    if len(transcribe_text) == 0:
        transcribe_text = False
        

    print("Removing voice file from s3")
    s3_client.delete_object(
        Bucket=settings.NEWS_BUCKET_NAME,
        Key=file_key,
    )

    return transcribe_text