const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, "../.env") })

class Settings{
  constructor(){
    this.ACCOUNT_SID = process.env.ACCOUNT_SID
    this.AUTH_TOKEN = process.env.AUTH_TOKEN
  }
}

module.exports = new Settings()