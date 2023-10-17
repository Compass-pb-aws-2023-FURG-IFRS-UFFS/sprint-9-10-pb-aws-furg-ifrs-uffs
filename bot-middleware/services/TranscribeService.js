const { TranscribeClient, StartTranscriptionJobCommand } = require("@aws-sdk/client-transcribe");
const { LOCALE_ID, REGION, TRANSCRIBE_NAME, BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = require("../core/config");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const params = {
    region: REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
}

const s3Client = new S3Client(params);

class TranscribeService {
    constructor() {
        this.transcribeClient = new TranscribeClient({region: REGION});
    }

    async transcribeMessage(audioFile) {
      const transcribeParams = {
        TranscriptionJobName: TRANSCRIBE_NAME,
        LanguageCode: LOCALE_ID,
        // MediaFormat: "mp3" || "mp4" || "wav" || "flac" || "ogg" || "amr" || "webm" || "m4a",
        Media: {
          MediaFileUri: new GetObjectCommand({
            "Bucket": BUCKET_NAME,
            "Key": audioFile,
          }),
        },
      }

      try {
        const command = new StartTranscriptionJobCommand(transcribeParams);
        const response = await this.transcribeClient.send(command);
        console.log("Success - put", response);
        return response;
      } catch (err){
        console.log("Error to transcribe a message in Amazon Transcribe", err);
        throw new Error("Error in Amazon Transcribe");
      }
    }
}

module.exports = TranscribeService;