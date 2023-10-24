const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, "../.env") })

class Settings{
  constructor(){
    this.BUCKET_NAME = process.env.BUCKET_NAME
    this.ACCOUNT_SID = process.env.ACCOUNT_SID
    this.AUTH_TOKEN = process.env.AUTH_TOKEN
    this.BOT_ID = process.env.BOT_ID
    this.BOT_ALIAS_ID = process.env.BOT_ALIAS_ID
    this.LOCALE_ID = process.env.LOCALE_ID
    this.TWILIO_DEFAULT_NUMBER = process.env.TWILIO_DEFAULT_NUMBER
    this.REGION = process.env.REGION
    this.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
    this.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
  }
}

module.exports = new Settings()