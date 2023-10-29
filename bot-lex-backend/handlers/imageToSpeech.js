const { isImage } = require("../helper/helper")
const { textToSpeech } = require("./textToSpeech")
const axios = require("axios")
const { IMAGE_TO_TEXT_API } = require("../core/config")

const imageToSpeech = async (message) => {
  try {
    let response = "This format is not acceptable, please try again and send an Image"
    if (isImage(message)) {
      const url = new URLSearchParams(message).get("bucketKey")
      const params = {
        image: url
      }
      const data = await axios.post(IMAGE_TO_TEXT_API, params)
      const text = data["data"]
      response = await textToSpeech(text)
    }
    return response
  } catch(error) {
    throw new Error("An error ocurred in imageToSpeech")
  }
}
module.exports = { imageToSpeech }