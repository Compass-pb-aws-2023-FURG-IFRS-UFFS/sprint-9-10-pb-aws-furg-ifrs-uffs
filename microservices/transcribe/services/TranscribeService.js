const {
  TranscribeClient,
  StartTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");
const Settings = require("../core/config.js");
const BUCKET_NAME = Settings.BUCKET_NAME;
const { createHash } = require("../helper/helper.js");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

class TranscribeService {
  constructor() {
    this.transcribeClient = new TranscribeClient();
  }

  async transcribeMessage(audioFile) {
    const transcribeParams = {
      TranscriptionJobName: createHash(audioFile), // tratar quando passar o mesmo audiofile e erros
      LanguageCode: "pt-BR",
      MediaFormat: "ogg",
      Media: {
        MediaFileUri: audioFile,
      },
      OutputBucketName: BUCKET_NAME,
    };
    
    try {
      const command = new StartTranscriptionJobCommand(transcribeParams);
      const response = await this.transcribeClient.send(command);
      console.log("Success - put", response);
      console.log("Waiting for transcription to complete...");
      console.log("bucketkey" + JSON.stringify(response.TranscriptionJob.TranscriptionJobName));
      
      const s3Params = {
        Bucket: BUCKET_NAME,
        Key: `${JSON.stringify(response.TranscriptionJob.TranscriptionJobName).replace(/^"(.*)"$/, '$1')}.json`,
      };
      console.log(`s3Params: ${JSON.stringify(s3Params)}`);

      const s3Client = new S3Client();
      const s3Command = new GetObjectCommand(s3Params);
      const s3Response = await s3Client.send(s3Command);
      console.log("Success - get", s3Response);

      return s3Response;
    } catch (err) {
      console.log("Error to transcribe a message in Amazon Transcribe", err);
      throw new Error("Error in Amazon Transcribe");
    }
  }
}

// (async() => {
//   const URI = "s3://equitalk-bucket/e6ac9de5a350cd42ca799dfda6af338626a350b030d9ac4afb3ae385406aca18.mp3"
//   const resp = await new TranscribeService().transcribeMessage(URI)
//   console.log("executou");
//   console.log(resp)
//   // console.log(BUCKET_NAME);
// })()

module.exports = TranscribeService;
