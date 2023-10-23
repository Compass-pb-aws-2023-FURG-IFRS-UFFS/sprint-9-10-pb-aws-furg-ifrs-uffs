const { handleResponse } = require("./helper/helper");
const { handleImage, handleAudio } = require("./helper/media");
const {ACCOUNT_SID} = require("./core/config")
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
      // const url = formData["MediaUrl0"];
      const messageSid = formData["MessageSid"]
      const mediaId = Array.from(formData["MediaUrl0"].split("Media/")).pop();
      console.log("media id");
      console.log(mediaId);
      console.log("extensao");
      console.log(extension);
      const urlNova = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages/${messageSid}/Media/${mediaId}`
      console.log("nova URL");
      console.log(urlNova);
      const actions = {
        audio: handleAudio,
        image: handleImage,
      };
      if (actions[type]) {
        // Espere até que a função handleImage (ou handleAudio) seja concluída
        message = await actions[type](urlNova, extension);
      } else {
        message = "Unsupported content type";
      }
    }

    await twilioService.sendMessage(message, recipientNumber);

    return handleResponse(200, "Working");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


// https://api.twilio.com/2010-04-01/Accounts/AC940c1101135f46052e03ebf12a8a82ec/Messages/MMf498ab4175cfd1e6672421362c0a37f8/Media/ME505d50bc2f3265094b4ebbc9f472a031

// https://api.twilio.com/2010-04-01/Accounts/AC940c1101135f46052e03ebf12a8a82ec/Messages/MMf498ab4175cfd1e6672421362c0a37f8/Media/ME505d50bc2f3265094b4ebbc9f472a031%202023-10-23T22:40:15.709Z%2084c5df2f-9722-44d5-97a3-3e3d17706cb7%20INFO%20https://api.twilio.com/2010-04-01/Accounts/AC940c1101135f46052e03ebf12a8a82ec/Messages/MMf498ab4175cfd1e6672421362c0a37f8/Media/ME505d50bc2f3265094b4ebbc9f472a031