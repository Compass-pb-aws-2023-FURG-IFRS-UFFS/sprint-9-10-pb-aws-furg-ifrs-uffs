const axios = require("axios")
const { TEXT_TO_SPEECH_API, TEXT_FORMAT_EXPECTED } = require("../core/config")
const { isFormData } = require("../helper/helper")

/**
 * Converts text to speech using the specified Text-to-Speech API.
 *
 * @param {string} message - The text message to be converted to speech.
 * @returns {Promise<string>} - A Promise that resolves to the generated speech audio.
 * @throws {Error} - Throws an error if the conversion fails.
 */
const textToSpeech = async (message) => {
  try {
    // Set default response
    let response = TEXT_FORMAT_EXPECTED

    if (!isFormData(message)) {
      // Send a request to the Text-to-Speech API to convert text to speech
      const apiResponse = await axios.post(TEXT_TO_SPEECH_API, { body: message })
      response = apiResponse["data"]["response"]
    }
    return response
  } catch (error) {
    throw new Error("An error ocurred in textToSpeech")
  }
}
module.exports = { textToSpeech }