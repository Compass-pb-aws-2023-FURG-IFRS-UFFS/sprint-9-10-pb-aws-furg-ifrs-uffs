const { handleResponse } = require("../helper/helper")

async function imageToText(event, context) {

  // Code
  return handleResponse(200, "imageToText")
}

module.exports = { imageToText }