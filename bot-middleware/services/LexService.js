const {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} = require("@aws-sdk/client-lex-runtime-v2");
const { BOT_ID, BOT_ALIAS_ID, LOCALE_ID } = require("../core/config");
const PollyService = require("./PollyService");
const TranscribeService = require("./TranscribeService");

class LexService {
  constructor() {
    this.lexClient = new LexRuntimeV2Client();
  }

  async sendMessage(message, sessionId) {
    const params = {
      botId: BOT_ID,
      botAliasId: BOT_ALIAS_ID,
      localeId: LOCALE_ID,
      sessionId: sessionId,
      text: message,
    };

    const command = new RecognizeTextCommand(params);

    try {
      const response = await this.lexClient.send(command);
      console.log("Response from Amazon Lex V2:", response);
      const intentName = response.interpretations[0].intent.name;
      if (intentName == "Text-to-Speech") {
        const pollyService = new PollyService();
        const audio = await pollyService.textToSpeech(message);
        console.log(audio);
        return audio;
      } else if (intentName == "Speech-to-Text") {
        const transcribeService = new TranscribeService();
        const text = await transcribeService.transcribeMessage(message);
        console.log(text);
        return text;
      }
      return response.messages[0].content;
    } catch (error) {
      console.error("Error to send a message to Amazon Lex V2:", error);
      throw new Error("Error in amazon lex");
    }
  }
}

module.exports = LexService;
