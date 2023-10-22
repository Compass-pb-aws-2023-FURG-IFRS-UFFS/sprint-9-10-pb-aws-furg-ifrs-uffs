const { TWILIO_DEFAULT_NUMBER, AUTH_TOKEN, ACCOUNT_SID } = require("../core/config");
const client = require('twilio')

class TwilioService {
  constructor() {
    this.twilioClient = client(ACCOUNT_SID, AUTH_TOKEN);
  }

  /**
  * Sends a message to a specific number. This is a shortcut for sending a message to TWILIO_DEFAULT_NUMBER
  * 
  * @param body - The text of the message
  * @param recipientNumber - The number to send the message to. Must be in the range 1 -
  */
  async sendMessage(body, recipientNumber) {
    const params = {
      body: body,
      from: TWILIO_DEFAULT_NUMBER,
      to: recipientNumber,
    };
    try {
      await this.twilioClient.messages.create(params);
    } catch (error) {
      console.log("Ocurred an error");
      throw new Error("Error in twilio");
    }
  }
  
  /**
  * Send a media message to a phone number. You must have the S3 bucket on the account to use this method
  * 
  * @param body - The url of the media to send
  * @param recipientNumber - The number of the recipient to send the message
  */
  async sendMedia(body, recipientNumber) {
    const params = {
      //body: body,
      from: TWILIO_DEFAULT_NUMBER,
      to: recipientNumber,
      mediaUrl: [
        body //"https://equitalk-bucket-john-new-1.s3.amazonaws.com/audio_391ea1004aa07a355c3c5d3a92fb60e1692ea3fa5d6685c1deee43d8ecbcaa75.mp3",
      ]
    };
    console.log("Params: ", params);
    try {
      await this.twilioClient.messages.create(params);   
    } catch (error) {
      console.log("Ocurred an error");
      throw new Error("Error in twilio");
    }
  }
}

module.exports = TwilioService;
