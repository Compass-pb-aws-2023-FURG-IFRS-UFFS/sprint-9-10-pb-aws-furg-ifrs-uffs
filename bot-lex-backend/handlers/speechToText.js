const axios = require("axios")
const { isAudio } = require("../helper/helper")
const { SPEECH_FORMAT_EXPECTED, OBJECT_URL, SPEECH_TO_TEXT_API } = require("../core/config")

const speechToText = async (message) => {
  let response = SPEECH_FORMAT_EXPECTED
  if (isAudio(message)) {
    const bucketKey = new URLSearchParams(message).get("bucketKey")
    const url = `${OBJECT_URL}/${bucketKey}`
    
    const data = await axios.post(SPEECH_TO_TEXT_API, { body: url })
    response = data["data"]["response"]
  }
  return response
}
module.exports = { speechToText }