const LexService = require("./services/LexService")
const TwilioService = require("./services/TwilioService")
const S3Service = require("./services/S3Service")
const { handleResponse } = require("./helper/helper")

const MEDIA_TYPES = {
  AUDIO: "audio",
  IMAGE: "image"
}

const handleIntent = async (event, context) => {
  try {
    const iterator = new URLSearchParams(event.body).entries()
    const dataObj = Object.fromEntries(iterator)
    const { NumMedia, From: recipientNumber, WaId: sessionId, Body, MediaContentType0, MediaUrl0 } = dataObj
    let messageToLex = Body
    if (NumMedia !== "0") {
      const type = MediaContentType0.split("/")[0]
      if (type === MEDIA_TYPES.AUDIO || type === MEDIA_TYPES.IMAGE) {
        const extension = type === MEDIA_TYPES.AUDIO ? "ogg" : "jpeg"
        const mediaBody = await new TwilioService().handleDownload(MediaUrl0)
        const bucketKey = await new S3Service().saveToS3(mediaBody, extension)
        const messageParams = {
          media: type,
          extension: extension,
          bucketKey: bucketKey
        }
        messageToLex = new URLSearchParams(messageParams).toString()
      }
    }

    const messageToUser = await new LexService().sendMessage(messageToLex, sessionId)
    await new TwilioService().sendMessage(messageToUser, recipientNumber)
    return handleResponse(200, messageToUser)
  } catch (error) {
    console.error("Error:", error)
    return handleResponse(500, "Internal Server Error")
  }
}

module.exports = { handleIntent }
