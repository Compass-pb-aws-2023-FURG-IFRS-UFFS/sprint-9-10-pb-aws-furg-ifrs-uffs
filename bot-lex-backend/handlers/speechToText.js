const axios = require("axios")
const { isAudio } = require("../helper/helper")
const { SPEECH_FORMAT_EXPECTED, OBJECT_URL, SPEECH_TO_TEXT_API } = require("../core/config")

/**
 * Converts audio to text using the specified Speech-to-Text API.
 * 
 * @param {object} message - The message object containing audio information.
 * @param {string} message.bucketKey - The bucket key for the audio file.
 * @returns {Promise<string>} - A Promise that resolves to the converted text.
 * @throws {Error} - Throws an error if the conversion fails.
 */
const speechToText = async (message) => {
  try {
    // Set default response
    let response = SPEECH_FORMAT_EXPECTED

    if (isAudio(message)) {
      // Extract bucketKey from the message URL parameter
      const bucketKey = new URLSearchParams(message).get("bucketKey")
      const url = `${OBJECT_URL}/${bucketKey}`

      // Send a request to the Speech-to-Text API to convert audio to text
      const apiResponse = await axios.post(SPEECH_TO_TEXT_API, { body: url })

      response = apiResponse["data"]["response"]
    }

    return response
  } catch (error) {
    throw new Error("An error ocurred in speechToText")
  }
}
module.exports = { speechToText }