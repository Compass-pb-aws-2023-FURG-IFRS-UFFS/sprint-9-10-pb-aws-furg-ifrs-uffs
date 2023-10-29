const { textToSpeech } = require("./handlers/textToSpeech")
const { speechToText } = require("./handlers/speechToText")
const { imageToText } = require("./handlers/imageToText")
const { imageToSpeech } = require("./handlers/imageToSpeech")
const { prepareResponse } = require("./helper/helper")

const intentHandlers = {
  "Text-to-Speech": textToSpeech,
  "Speech-to-Text": speechToText,
  "Image-to-Text": imageToText,
  "Image-to-Speech": imageToSpeech
}
const handler = async (event,context) => {
  try {
    const body = event['sessionState']['intent']
    const intentName = body['name']
    const messageFromUser = body["slots"]["texto"]["value"]["originalValue"]
    if (!message || message == "") {
      throw new Error("Invalid message format");
    }
    const messageToUser = await intentHandlers[intentName](messageFromUser)

    return prepareResponse(event, messageToUser)
  } catch(error) {
    return prepareResponse(event, "An Error Ocurred in amazon lex")
  }
}

module.exports = { handler }


