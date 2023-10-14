const { handleResponse } = require("../helper/helper")

async function imageToSpeech(event, context) {

  // Code
  return handleResponse(200, "imageToSpeech")
};

module.exports = imageToSpeech