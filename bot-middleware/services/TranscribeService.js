const { TranscribeClient, StartTranscriptionJobCommand } = require("@aws-sdk/client-transcribe");
const { REGION, BUCKET_NAME } = require("../core/config");
const createHash = require("../helper/helper").createHash;

class TranscribeService {
    constructor() {
        this.transcribeClient = new TranscribeClient({region: REGION});
    }

    async transcribeMessage(audioFile) {
      const transcribeParams = {
        TranscriptionJobName: createHash(audioFile),
        LanguageCode: "pt-BR",
        // MediaFormat: "mp3" || "mp4" || "wav" || "flac" || "ogg" || "amr" || "webm" || "m4a",
        MediaFormat: "ogg",
        Media: {
          MediaFileUri: audioFile
        },
        OutputBucketName: BUCKET_NAME,
      }

      try {
        const command = new StartTranscriptionJobCommand(transcribeParams);
        const response = await this.transcribeClient.send(command);
        console.log("Success - put", response);
        console.log("Waiting for transcription to complete...");
        return response;
      } catch (err){
        console.log("Error to transcribe a message in Amazon Transcribe", err);
        throw new Error("Error in Amazon Transcribe");
      }
    }
}

module.exports = TranscribeService;