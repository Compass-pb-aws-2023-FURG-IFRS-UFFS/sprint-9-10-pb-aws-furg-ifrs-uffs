const { TWILIO_DEFAULT_NUMBER, AUTH_TOKEN, ACCOUNT_SID } = require("../core/config");
const client = require('twilio')

class TwilioService {
  constructor() {
    this.twilioClient = client(ACCOUNT_SID, AUTH_TOKEN);
  }

  async sendMessage(body, recipientNumber) {
    const params = {
      body: body,
      from: TWILIO_DEFAULT_NUMBER,
      to: recipientNumber
    }
    try {
      await this.twilioClient.messages.create(params)
    } catch(error) {
      console.log("Ocurred an error");
      throw new Error("Error in twilio")
    }
  }
}

module.exports = TwilioService;
