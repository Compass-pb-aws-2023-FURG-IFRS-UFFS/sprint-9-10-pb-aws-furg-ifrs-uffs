const PollyService = require("./services/PollyService");

/**
* Handles the event and returns the response. Note that this is a blocking call
* 
* @param event - The event to handle.
* 
* @return { Object } The response to send to the client
*/
async function handler(event) {

  const texto = JSON.parse(event.body).body;
  const pollyService = new PollyService();
  const url = await pollyService.textToSpeech(texto);
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      response: url,
    }),
  };
  return response;
}

module.exports = { handler };
