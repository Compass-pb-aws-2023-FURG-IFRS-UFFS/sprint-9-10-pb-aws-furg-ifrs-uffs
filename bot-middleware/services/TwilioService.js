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
      // Send the message using Twilio API
      await this.twilioClient.messages.create(params)
    } catch (error) {
      throw new Error("Error occurred while sending the message in Twilio.")
    }
  }

  /**
   * Sends an audio to a specific phone number.
   *
   * @param {string} mediaUrl - The mediaUrl of the message.
   * @param {string} recipientNumber - The phone number to send the message to.
   * @returns {Promise<string>} - A success message or an error message.
   */
  async sendAudio(url, recipientNumber) {
    const params = {
      mediaUrl: [url],
      from: TWILIO_DEFAULT_NUMBER,
      to: recipientNumber,
    }

    try {
      // Send the message using Twilio API
      await this.twilioClient.messages.create(params)
    } catch (error) {
      throw new Error("Error occurred while sending the message in Twilio.")
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
      // Send a GET request to the specified media URL with authentication
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        auth: {
          username: ACCOUNT_SID,
          password: AUTH_TOKEN,
        },
      })

      // Convert the response data to base64 encoded string and then to Buffer
      const imageData = Buffer.from(response.data, "binary").toString("base64")
      const imageBuffer = Buffer.from(imageData, "base64")

      return imageBuffer
    } catch (error) {
      throw new Error("Error occurred while downloading the image in Twilio.")
    }
  }
}

module.exports = TwilioService
