const { isAudio, isImage } = require("../helper/helper")
const { TEXT_TO_SPEECH_API } = require("../core/config")
const axios = require("axios")

const textToSpeech = async (message) => {
  try {
    let response = "An Error ocurred"
    if (isAudio(message) || isImage(message)) {
      response = "This format is not acceptable, please try again and send an Text"
    } else {
      const params = {
        body: message
      }
      const data = await axios.post(TEXT_TO_SPEECH_API, params)
      response = data["data"]["response"]
    }
    return response;
  } catch (error) {
    throw new Error("Error in amazon polly")
  }

}
module.exports = { textToSpeech }