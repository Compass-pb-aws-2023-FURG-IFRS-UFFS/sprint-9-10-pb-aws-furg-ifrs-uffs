const axios = require("axios")
const { TEXT_TO_SPEECH_API, TEXT_FORMAT_EXPECTED } = require("../core/config")
const { isFormData } = require("../helper/helper")

const textToSpeech = async (message) => {
  try {
    let response = TEXT_FORMAT_EXPECTED
    if (!isFormData(message)) {
      const data = await axios.post(TEXT_TO_SPEECH_API, { body: message })
      response = data["data"]["response"]
    }
    return response
  } catch (error) {
    throw new Error("An error ocurred in textToSpeech")
  }
}
module.exports = { textToSpeech }