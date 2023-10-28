const { TWILIO_DEFAULT_NUMBER, AUTH_TOKEN, ACCOUNT_SID } = require("../core/config")

const client = require("twilio")
const axios = require("axios")

/**
 * Service for interacting with Twilio API.
 * @class
 * @author Josué Fernandes
 */
class TwilioService {

  constructor() {
      /**
     * Twilio client for sending messages.
     * @type {require("twilio").Twilio}
     */
    this.twilioClient = client(ACCOUNT_SID, AUTH_TOKEN)
  }

  /**
   * Sends a message to a specific phone number.
   *
   * @param {string} body - The text of the message.
   * @param {string} recipientNumber - The phone number to send the message to.
   * @returns {Promise<string>} - A success message or an error message.
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
      console.error("Unexpected error:", error)
    }
  }

  /**
   * Handles downloading media from a given URL.
   *
   * @param {string} mediaUrl - The URL of the media to be downloaded.
   * @returns {Promise<Buffer>} - The downloaded media as a Buffer.
   * @throws {Error} - Throws an error if the download fails.
   */
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
      console.error("Request error:", error)
      throw error
    }
  }
}

module.exports = TwilioService
