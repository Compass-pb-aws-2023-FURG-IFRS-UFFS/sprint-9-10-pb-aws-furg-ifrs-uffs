const { isImage } = require("../helper/helper")
const axios = require("axios")
const { IMAGE_TO_TEXT_API } = require("../core/config")

const imageToText = async (message) => {
  try {
    let response = "This format is not acceptable, please try again and send an Image"
    if(isImage(message)) {
      const url = new URLSearchParams(message).get("bucketKey")
      const params = {
        image: url
      }
      const data = await axios.post(IMAGE_TO_TEXT_API, params)
      response = data["data"]
    }
    return response
  } catch(error) {
    throw new Error("An error ocurred in imageToText")
  }
}
module.exports = { imageToText }

