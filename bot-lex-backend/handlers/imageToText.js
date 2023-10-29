const { isImage } = require("../helper/helper")

const imageToText = async (message) => {
  console.log("imageToText");
  let response = "This format is not acceptable, please try again and send an Image"
  if(isImage(message)) {
    // logic
    response = message
  }
  console.log(response);
  return response
}
module.exports = { imageToText }

