const { isImage } = require("../helper/helper")
const { textToSpeech } = require("./textToSpeech")
const axios = require("axios")
const { IMAGE_TO_TEXT_API, IMAGE_FORMAT_EXPECTED } = require("../core/config")

/**
 * Converts an image to speech using the 2 specified  APIs Image-to-Text and Text-to-Speech.
 *
 * @param {object} message - The message object containing image information.
 * @param {string} message.bucketKey - The bucket key for the image file.
 * @returns {Promise<object>} - A Promise that resolves to the extracted text from the image.
 * @throws {Error} - Throws an error if the conversion fails.
 */
const imageToSpeech = async (message) => {
  try {
    // Set default response
    let response = IMAGE_FORMAT_EXPECTED

    if (isImage(message)) {
      // Extract bucketKey from the message URL parameter
      const url = new URLSearchParams(message).get("bucketKey")

      // Send a request to the Image-to-Text API to convert image to text
      const apiResponse = await axios.post(IMAGE_TO_TEXT_API, { image: url })
      const text = apiResponse["data"]

      response = await textToSpeech(text)
    }
    return response
  } catch (error) {
    throw new Error("An error ocurred in imageToSpeech")
  }
}
module.exports = { imageToSpeech }