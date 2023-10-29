const { isImage } = require("../helper/helper")

const imageToSpeech = async (message) => {
  console.log("imageToSpeech");
  let response = "This format is not acceptable, please try again and send an Image"
  if(isImage(message)) {
    // logic
    response = message
  }
  console.log(response);
  return response
}

module.exports = { imageToSpeech }