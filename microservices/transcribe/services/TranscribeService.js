const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand
} = require("@aws-sdk/client-transcribe");
const { BUCKET_NAME } = require("../core/config");
const { createHash, getTranscriptionJob } = require("../helper/helper.js");

/**
 * Service for transcribing audio files using AWS Transcribe.
 */
class TranscribeService {
  constructor() {
    this.transcribeClient = new TranscribeClient();
  }

  /**
   * Transcribes an audio file and returns the transcription text.
   *
   * @param {string} audioFile - The URI of the audio file to transcribe.
   * @returns {Promise<string>} - A Promise that resolves to the transcription text.
   */
  async transcribeMessage(audioFile) {
    try {
      const min = 1;
      const max = 100;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const jobName = createHash(audioFile) + randomNumber;

      const startTranscriptionParams = {
        TranscriptionJobName: jobName,
        LanguageCode: "pt-BR",
        MediaFormat: "ogg",
        Media: { MediaFileUri: audioFile },
        OutputBucketName: BUCKET_NAME,
      };
      const command = new StartTranscriptionJobCommand(startTranscriptionParams);
      const data = await this.transcribeClient.send(command);
      while (true) {
        const getTranscriptionJobParams = {
            TranscriptionJobName: data.TranscriptionJob.TranscriptionJobName,
        };
        const getTranscriptionJobCommand = new GetTranscriptionJobCommand(getTranscriptionJobParams);
        const dataTranscription = await this.transcribeClient.send(getTranscriptionJobCommand);
        const transcriptionJobStatus = dataTranscription.TranscriptionJob.TranscriptionJobStatus;

        if (transcriptionJobStatus === "COMPLETED") {
          const response = await getTranscriptionJob(
            dataTranscription.TranscriptionJob.Transcript.TranscriptFileUri
          );
          return response;        
        } else if (
          transcriptionJobStatus === "FAILED" ||
          transcriptionJobStatus === "CANCELED"
        ) {
          const response = "O trabalho de transcrição falhou ou foi cancelado.";
          return response; 
        } else {
          console.log("Ainda em andamento. Status:", transcriptionJobStatus);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    } catch (error) {
      console.error("Erro ao iniciar o trabalho de transcrição:", error);
    }
  }
}
module.exports = TranscribeService;
