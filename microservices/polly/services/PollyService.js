const {
  PollyClient,
  StartSpeechSynthesisTaskCommand,
  GetSpeechSynthesisTaskCommand,
} = require("@aws-sdk/client-polly");
const { BUCKET_NAME } = require("../core/config");

class PollyService {
  constructor() {
    this.polly = new PollyClient();
  }

  /**
   * Converts text to speech. Speech is stored in S3 so it can be played in other applications
   *
   * @param text - The text to synthesize.
   *
   * @return {string} - The URL of the audio file in S3. If an error occurs, returns null.
   */
  async textToSpeech(text) {
    const speechParams = {
      Text: text,
      TextType: "text",
      OutputFormat: "mp3",
      VoiceId: "Camila",
      LanguageCode: "pt-BR",
      OutputS3BucketName: BUCKET_NAME,
    };

    try {
      const command = new StartSpeechSynthesisTaskCommand(speechParams);
      const data = await this.polly.send(command);
      const taskId = data.SynthesisTask.TaskId;
      console.log("Task ID:", taskId);
      while (true) {
        const getSpeechSynthesisTaskParams = {
          TaskId: taskId,
        };
        const getSpeechSynthesisTaskCommand = new GetSpeechSynthesisTaskCommand(
          getSpeechSynthesisTaskParams
        );
        const dataTask = await this.polly.send(getSpeechSynthesisTaskCommand);
        const taskStatus = dataTask.SynthesisTask.TaskStatus;
        if (taskStatus === "completed") {
          const url = dataTask.SynthesisTask.OutputUri;
          return url;
        } else if (taskStatus === "failed") {
          const response = "O trabalho de transcrição falhou ou foi cancelado.";
          return response;
        } else {
          console.log("Ainda em andamento. Status:", taskStatus);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      return "Erro inesperado";
    }
  }
}

module.exports = PollyService;