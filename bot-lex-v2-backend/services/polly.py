import boto3
from botocore.exceptions import BotoCoreError, ClientError

polly = boto3.client('polly')


def tts_output_directly_on_s3(news_text, bucket_name, key):
    try:
        # news text to speech
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
        
        # reurns audio url
        return f"https://{bucket_name}.s3.amazonaws.com/{key}.{response['SynthesisTask']['TaskId']}.mp3"

    except (BotoCoreError, ClientError) as error:
        print(error) # CloudWatch log
        return None