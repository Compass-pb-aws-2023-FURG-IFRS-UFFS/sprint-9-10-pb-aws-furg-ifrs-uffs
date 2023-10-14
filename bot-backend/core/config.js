const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, "../.env") })

class Settings{
  constructor(){
    this.BUCKET_NAME = process.env.BUCKET_NAME
  }
}

module.exports = new Settings()