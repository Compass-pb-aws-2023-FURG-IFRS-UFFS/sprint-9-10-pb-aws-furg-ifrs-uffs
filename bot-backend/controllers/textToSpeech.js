const { handleResponse } = require("../helper/helper")

async function textToSpeech(event, context) {

  // Code
  return handleResponse(200, "textToSpeech")
};

module.exports = textToSpeech