const LexException = require("../exceptions/aws-exceptions/LexException");
const { BOT_ID, BOT_ALIAS_ID, LOCALE_ID } = require("../core/config");
const TranscribeService = require("./TranscribeService");
const PollyService = require("./PollyService");
const {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} = require("@aws-sdk/client-lex-runtime-v2");

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
      const intentName = returnLex.sessionState.intent.name;
      console.log(intentName);
      if (intentName == "Text-to-Speech") {
        const sessionState = returnLex.sessionState.dialogAction.type;
        console.log(sessionState);
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
      } else {
        response = "Escolha um serviço:\n\n" +
                   "1️⃣ Texto para Áudio   \n" +
                   "2️⃣ Áudio para Texto   \n" +
                   "3️⃣ Imagem para Texto   \n" +
                   "4️⃣ Imagem para Áudio";
        return returnLex.messages[0].content + "\n\n"  + response;
      }
      return response;
    } catch (error) {
      if (error.Code) {
        const errorCode = error.Code;
        throw LexException.handleLexException(errorCode);
      } else {
        console.error("Erro inesperado:", error);
        return "Erro inesperado";
      }
    }
    // return returnLex
  }
}

module.exports = LexService;
