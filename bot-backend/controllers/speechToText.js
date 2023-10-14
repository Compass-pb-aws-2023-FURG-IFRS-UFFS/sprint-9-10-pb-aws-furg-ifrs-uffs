const { handleResponse } = require("../helper/helper")

async function speechToText(event, context) {

  // Code
  return handleResponse(200, "speechToText")
}

module.exports = { speechToText }