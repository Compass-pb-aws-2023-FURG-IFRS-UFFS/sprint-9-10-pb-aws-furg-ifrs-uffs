const {
  PollyClient,
  SynthesizeSpeechCommand,
} = require("@aws-sdk/client-polly");
//const S3Exception = require("../../../bot-middleware/exceptions/aws-exceptions/S3Exception");
//const PollyException = require("../../../bot-middleware/exceptions/aws-exceptions/PollyException");
const { S3Client, PutObjectCommand, S3 } = require("@aws-sdk/client-s3");
const createHash = require("../helper/helper").createHash;
const {BUCKET_NAME} = require("../core/config");

const s3Client = new S3Client();

class PollyService {
  constructor() {
    this.polly = new PollyClient();
  }

  /**
   * Converts text to speech. Speech is stored in S3 so it can be played in other applications
   *
   * @param text - The text to synthesize.
   *
   * @return {string} The URL of the audio file in S3. If an error occurs, returns null.
   */
  async textToSpeech(text) {
    const speechParams = {
      Text: text,
      OutputFormat: "ogg_vorbis",
      VoiceId: "Camila",
      LanguageCode: "pt-BR",
    };

    try {
      const command = new SynthesizeSpeechCommand(speechParams);
      const data = await this.polly.send(command);

      // Appends chunks of audio to the end of the request. This is called when data. AudioStream. on ('data') is called
      const audioChunks = [];
      data.AudioStream.on("data", (chunk) => {
        audioChunks.push(chunk);
      });
      await new Promise((resolve, reject) => {
        data.AudioStream.on("end", resolve);
        data.AudioStream.on("error", reject);
      });

      const audio = Buffer.concat(audioChunks);

      const s3Params = {
        Bucket: BUCKET_NAME,
        Key: "audio_" + createHash(text) + ".mp3",
        Body: audio,
      };

      // Uploads the audio to S3
      try {
        const s3Command = new PutObjectCommand(s3Params);
        await s3Client.send(s3Command);
      } catch (error) {
        //if (error.Code) {
        //  const errorCode = error.Code;
        //  throw S3Exception.handleS3Exception(errorCode);
        //} else {
        //  console.error("Erro inesperado:", error);
        //}
        console.error("Erro inesperado:", error);
      }

      // Get the URL of the audio file in S3
      const urlParams = {
        Bucket: BUCKET_NAME,
        Key: s3Params.Key,
        Expires: 3600, // URL expires in 1 hour
      };

      // Returns URL to S3 bucket with parameters set in params.
      const url =
        "https://" + BUCKET_NAME + ".s3.amazonaws.com/" + s3Params.Key;

      return url;
    } catch (error) {
      if (error.Code) {
        const errorCode = error.Code;
        throw PollyException.handlePollyException(errorCode);
      } else {
        console.error("Erro inesperado:", error);
        return "Erro inesperado";
      }
    }
  }
}

module.exports = PollyService;
