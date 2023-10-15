const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, "../.env") })

class Settings{
  constructor(){
    this.ACCOUNT_SID = process.env.ACCOUNT_SID
    this.AUTH_TOKEN = process.env.AUTH_TOKEN
    this.BOT_ID = process.env.BOT_ID
    this.BOT_ALIAS_ID = process.env.BOT_ALIAS_ID
    this.LOCALE_ID = process.env.LOCALE_ID
  }
}

module.exports = new Settings()