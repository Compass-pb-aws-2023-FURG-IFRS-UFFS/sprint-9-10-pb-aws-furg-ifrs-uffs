const { BOT_ID, BOT_ALIAS_ID, LOCALE_ID, INITIAL_MESSAGE } = require("../core/config");
const { LexRuntimeV2Client, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2");

/**
 * Service class for interacting with Amazon Lex service.
 */
class LexService {

  /**
   * Constructor for LexService class.
   * Initializes the LexRuntimeV2Client.
   */
  constructor() {
    this.lexClient = new LexRuntimeV2Client();
  }

  /**
   * Sends a message to Amazon Lex and receives a response.
   *
   * @param {string} message - The message to be sent to the bot.
   * @param {string} sessionId - The unique identifier for the user's session.
   * @returns {Promise<string>} - A promise that resolves to the response from the bot.
   */
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
      const intentName = returnLex.sessionState.intent.name;

      if(returnLex.messages) response = returnLex.messages[0].content;
      if (intentName === "Hello") response += INITIAL_MESSAGE
      
      return response;
    } catch (error) {
      console.error("Unexpected error:", error);
      return "Unexpected error occurred";
    }
  }
}

module.exports = LexService;
