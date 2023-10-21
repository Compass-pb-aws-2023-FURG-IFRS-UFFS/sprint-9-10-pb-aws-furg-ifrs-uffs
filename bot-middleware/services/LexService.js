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
      const returnLex = await this.lexClient.send(command);
      let response = "";
      console.log("Response from Amazon Lex V2:", returnLex);
      const intentName = returnLex.interpretations[0].intent.name; 
      if (intentName == "Text-to-Speech") {
        const sessionState = returnLex.sessionState.dialogAction.type;
        if (sessionState == "ElicitSlot") {
          response = returnLex.messages[0].content;
        } else {
          const pollyService = new PollyService();
          response = await pollyService.textToSpeech(message);
        }
      } else if (intentName == "Speech-to-Text") {        
        const transcribeService = new TranscribeService();
        response = await transcribeService.transcribeMessage(message);
        console.log("Transcribe response:", response);
      }else{
        response = returnLex.messages[0].content;
      }
      return response;
    } catch (error) {
      console.error("Error to send a message to Amazon Lex V2:", error);
      throw new Error("Error in amazon lex");
    }
  }
}

module.exports = LexService;
