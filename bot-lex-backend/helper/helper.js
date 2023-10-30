/**
 * Prepares the response to be sent back to Amazon Lex.
 *
 * @param {object} event - The event object containing request details.
 * @param {string} msgText - The message text to be sent back to Amazon Lex.
 * @returns {object} - The formatted response object for Amazon Lex.
 */
function prepareResponse(event, msgText) {

  const response = {
    "sessionState": {
      "dialogAction": {
        "type": "Close"
      },
      "intent": {
        "name": event['sessionState']['intent']['name'],
        "slots": event['sessionState']['intent']['slots'],
        "state": "Fulfilled"
      }
    },
    "messages": [
      {
        "contentType": "PlainText",
        "content": msgText
      }
    ]
  }

  return response
}

/**
 * Checks if the provided dataString represents audio content.
 *
 * @param {string} dataString - The string to be checked.
 * @returns {boolean} - True if the string represents audio content, false otherwise.
 */
const isAudio = (dataString) => {
  return /^media=[a-z]{5}&extension=(mp3)&bucketKey=[a-z\d]+\.(mp3){1}$/.test(dataString)
}

/**
 * Checks if the provided dataString represents image content.
 *
 * @param {string} dataString - The string to be checked.
 * @returns {boolean} - True if the string represents image content, false otherwise.
 */
const isImage = (dataString) => {
  return /^media=[a-z]{5}&extension=(jpeg)&bucketKey=[a-z\d]+\.(jpeg){1}$/.test(dataString)
}

/**
 * Checks if the provided dataString represents form data.
 *
 * @param {string} dataString - The string to be checked.
 * @returns {boolean} - True if the string represents form data, false otherwise.
 */
const isFormData = (dataString) => {
  return /^media=[a-z]{0,}&extension=[a-z]{0,}&bucketKey=[a-z\d]+\.[a-z]{0,}$/.test(dataString)
}

module.exports = { prepareResponse, isAudio, isImage,isFormData }
