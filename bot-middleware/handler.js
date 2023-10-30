const LexService = require("./services/LexService")
const TwilioService = require("./services/TwilioService")
const S3Service = require("./services/S3Service")
const { handleResponse } = require("./helper/helper")

/**
 * Enumerates different media types.
 * @readonly
 * @enum {string}
 */
const MEDIA_TYPES = {
  AUDIO: "audio",
  IMAGE: "image"
}

const handleIntent = async (event, context) => {
  try {
    // Extract data from the incoming request
    const iterator = new URLSearchParams(event.body).entries()
    const dataObj = Object.fromEntries(iterator)
    const { NumMedia, From: recipientNumber, WaId: sessionId, Body, MediaContentType0, MediaUrl0 } = dataObj
    let messageToLex = Body

    // Check if there is media content in the message
    if (NumMedia !== "0") {
      const type = MediaContentType0.split("/")[0]

      if (type === MEDIA_TYPES.AUDIO || type === MEDIA_TYPES.IMAGE) {
        // Determine the file extension based on media type
        const extension = type === MEDIA_TYPES.AUDIO ? "mp3" : "jpeg"

        // Download media content and save it to Amazon S3, obtaining a bucket key
        const mediaBody = await new TwilioService().handleDownload(MediaUrl0)
        const bucketKey = await new S3Service().saveToS3(mediaBody, extension)

        // Prepare parameters for Lex service containing media details
        const messageParams = {
          media: type,
          extension: extension,
          bucketKey: bucketKey
        }
        // Convert parameters to a URL-encoded string and set it as the message for Lex
        messageToLex = new URLSearchParams(messageParams).toString()
      }
    }
    // Send the message to Lex service and receive a response
    const messageToUser = await new LexService().sendMessage(messageToLex, sessionId)
    
    // Send the response to the user via Twilio
    await new TwilioService().sendMessage(messageToUser, recipientNumber)

    return handleResponse(200, messageToUser)
  } catch (error) {
    console.error("Error:", error)
    return handleResponse(500, "Internal Server Error")
  }
}

module.exports = { handleIntent }
