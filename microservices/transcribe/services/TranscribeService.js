const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand
} = require("@aws-sdk/client-transcribe");
const { BUCKET_NAME } = require("../core/config");
const { createHash, getTranscriptionJob } = require("../helper/helper.js");

class TranscribeService {
  constructor() {
    this.transcribeClient = new TranscribeClient();
  }

  async transcribeMessage(audioFile) {
    try {
      const min = 1;
      const max = 100;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const jobName = createHash(audioFile) + randomNumber;
      // Iniciar o trabalho de transcrição
      // Esperar até que o trabalho de transcrição esteja completo
      const startTranscriptionParams = {
        TranscriptionJobName: jobName,
        LanguageCode: "pt-BR", // Código do idioma do áudio
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
          //  if(teste == 1){
          console.log("entrei na conclusão");
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
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Aguarde 5 segundos antes de verificar novamente
        }
      }
    } catch (error) {
      console.error("Erro ao iniciar o trabalho de transcrição:", error);
    }
  }
}
module.exports = TranscribeService;
