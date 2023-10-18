const createHash = require("../helper/utils").createHash;
const {PollyClient,SynthesizeSpeechCommand} = require("@aws-sdk/client-polly");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  BUCKET_NAME,
} = require("../core/config");

const params = {
  region: REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
};

const s3Client = new S3Client(params);

class PollyService {
  constructor() {
    this.polly = new PollyClient(params);
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
      OutputFormat: "mp3",
      VoiceId: "Camila",
      LanguageCode: "pt-BR",
    };

    try {
      const command = new SynthesizeSpeechCommand(speechParams);
      const data = await this.polly.send(command);

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
        Key:
          "audio_" +
          createHash(text) +
          ".mp3",
        Body: audio,
      };

      const s3Command = new PutObjectCommand(s3Params);
      const s3Response = await s3Client.send(s3Command);

      console.log(s3Response);

      // Get the URL of the audio file in S3
      const urlParams = {
        Bucket: BUCKET_NAME,
        Key: s3Params.Key,
        Expires: 3600, // URL expires in 1 hour
      };
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand(urlParams)
      );
      return url;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = PollyService;
