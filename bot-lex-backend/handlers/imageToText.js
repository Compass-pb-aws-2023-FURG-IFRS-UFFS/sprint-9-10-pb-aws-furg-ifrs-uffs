const { isImage } = require("../helper/helper")
const axios = require("axios")
const { IMAGE_TO_TEXT_API, IMAGE_FORMAT_EXPECTED } = require("../core/config")

const imageToText = async (message) => {
  try {
    let response = IMAGE_FORMAT_EXPECTED
    if (isImage(message)) {
      const url = new URLSearchParams(message).get("bucketKey")
      const data = await axios.post(IMAGE_TO_TEXT_API, { image: url })
      
      response = data["data"]
    }
    return response
  } catch (error) {
    throw new Error("An error ocurred in imageToText")
  }
}
module.exports = { imageToText }

