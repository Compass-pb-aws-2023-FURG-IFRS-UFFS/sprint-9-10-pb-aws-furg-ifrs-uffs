const { handleAudio, handleImage, handleResponse } = require("./helper/helper");
const LexService = require('./services/LexService');
const TwilioService = require("./services/TwilioService");
const querystring = require('querystring');

const lexService = new LexService();
const twilioService = new TwilioService();

async function handleEvents(event) {
  try {
    console.log("EVENT\n\n\n", event);
    const formData = querystring.parse(event.body);
    console.log("BODY\n\n\n", formData);
    return formData;
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
}

module.exports.handleIntent = async (event, context) => {
  try {
    const formData = await handleEvents(event);
    const numMedia = formData["NumMedia"];
    const recipientNumber = formData["From"];
    const sessionId = formData["WaId"];
    let message = formData["Body"];
    
    if (numMedia == 0) {

      // Send the message to lex and obtain the response message
      message = await lexService.sendMessage(message, sessionId);
    } else {
      const [type, extension] = formData["MediaContentType0"].split("/");
      const url = formData["MediaUrl0"];

      const actions = {
        "audio": handleAudio,
        "image": handleImage
      };
      message = actions[type] ? actions[type](extension, url) : "Unsupported content type";
    }

    // Send the response to Twilio
    await twilioService.sendMessage(message, recipientNumber);
    
    return handleResponse(200, "Working");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
