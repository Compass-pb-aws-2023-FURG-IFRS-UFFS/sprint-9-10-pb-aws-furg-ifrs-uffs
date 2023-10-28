const LexService = require("./services/LexService")
const TwilioService = require("./services/TwilioService")
const S3Service = require("./services/S3Service")
const { handleResponse } = require("./helper/helper")

const handleIntent = async (event, context) => {
  try {
    const formData = new URLSearchParams(event["body"])

    const numMedia = formData.get("NumMedia")
    const recipientNumber = formData.get("From")
    const sessionId = formData.get("WaId")
    let messageToLex = formData.get("Body")

    if (numMedia != 0) {
      const type = formData.get("MediaContentType0").split("/")[0]
      if (type == "audio" || type == "image") {
        const mediaUrl = formData.get("MediaUrl0")
        const extension = type == "audio" ? "mp3" : "jpeg"
        const body = await new TwilioService().handleDownload(mediaUrl)
        const bucketKey = await new S3Service().saveToS3(body, extension)
        const params = {
          "media": type,
          "extension": extension,
          "bucketKey": bucketKey
        }
        messageToLex = new URLSearchParams(params).toString()
      }
    }
    console.log(sessionId);
    const messageToUser = await new LexService().sendMessage(messageToLex, sessionId)


    // await twilioService.sendMessage(message, recipientNumber)

    return handleResponse(200, messageToUser)
  } catch (error) {
    console.error("Error:", error)
    return handleResponse(500, "Internal Server Error")
  }
}

// async function handleIntent(event, context) {

//   return handleResponse(200, "Deu Bom")
// }
module.exports = { handleIntent }
