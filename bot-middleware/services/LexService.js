const { BOT_ID, BOT_ALIAS_ID, LOCALE_ID, INITIAL_MESSAGE } = require("../core/config");
const { LexRuntimeV2Client, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2");

/**
 * Service class for interacting with Amazon Lex service.
 * @class
 * @author Josué Fernandes
 */
class LexService {

  constructor() {
    /**
     * Amazon Lex client for sending messages and receiving responses.
     * @type {LexRuntimeV2Client}
     */
    this.lexClient = new LexRuntimeV2Client();
  }

  /**
   * Sends a message to Amazon Lex and receives a response.
   *
   * @param {string} message - The message to be sent to the bot.
   * @param {string} sessionId - The unique identifier for the user's session.
   * @returns {Promise<string>} - A promise that resolves to the response from the bot.
   * @throws {Error} - Throws an error if there is a problem sending the message to Lex.
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
      let response = "Occured an error"
      if(returnLex.messages[0]) response = returnLex.messages[0].content;
      if (intentName === "Hello") response += INITIAL_MESSAGE
      
      return response;
    } catch (error) {
      console.error("Unexpected error:", error);
      return "Unexpected error occurred";
    }
  }
}

module.exports = LexService;
