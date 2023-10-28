const { TWILIO_DEFAULT_NUMBER, AUTH_TOKEN, ACCOUNT_SID } = require("../core/config")

const client = require("twilio")
const axios = require("axios")

class TwilioService {
  constructor() {
    this.twilioClient = client(ACCOUNT_SID, AUTH_TOKEN)
  }

  /**
   * Sends a message to a specific number. This is a shortcut for sending a message to TWILIO_DEFAULT_NUMBER
   *
   * @param body - The text of the message
   * @param recipientNumber - The number to send the message to.
   */
  async sendMessage(body, recipientNumber) {
    const params = {
      body: body,
      from: TWILIO_DEFAULT_NUMBER,
      to: recipientNumber,
    }
    try {
      await this.twilioClient.messages.create(params)
    } catch (error) {
      console.error("Erro inesperado:", error)
      return "Erro inesperado"
    }
  }
  async handleDownload(mediaUrl) {
    try {
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        auth: {
          username: ACCOUNT_SID,
          password: AUTH_TOKEN,
        },
      })

      const imageData = Buffer.from(response.data, "binary").toString("base64")
      return Buffer.from(imageData, "base64")
    } catch (error) {
      console.error("Erro na solicitação:", error)
      throw error
    }
  }
}

module.exports = TwilioService
