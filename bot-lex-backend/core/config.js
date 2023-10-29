const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

/**
 * Represents the application settings loaded from environment variables.
 * @class
 * @author Josué Fernandes
 */
class Settings {
  constructor() {
    this.TEXT_TO_SPEECH_API = process.env.TEXT_TO_SPEECH_API
    this.SPEECH_TO_TEXT_API = process.env.SPEECH_TO_TEXT_API
    this.IMAGE_TO_TEXT_API = process.env.IMAGE_TO_TEXT_API
  }
}

module.exports = new Settings();
