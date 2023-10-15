const { LexRuntimeV2Client, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2");
const { BOT_ID, BOT_ALIAS_ID, LOCALE_ID } = require("../core/config");

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
      text: message
    };

    const command = new RecognizeTextCommand(params);

    try {
      const response = await this.lexClient.send(command);
      return response.messages[0].content;
    } catch (error) {
      console.error("Error to send a messago to Amazon Lex V2:", error);
    }
  }
}

module.exports = LexService;
