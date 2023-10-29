const { isAudio } = require("../helper/helper")

const speechToText = async (message) => {
  console.log("speechToText");
  let response = "This format is not acceptable, please try again and send an Audio"
  if(isAudio(message)) {
    // logic
    response = message
  }
  return response
}

module.exports = { speechToText }