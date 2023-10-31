const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

/**
 * Represents the application settings loaded from environment variables.
 * @class
 * @author Rafael Messias
 * @author Yuri Souza
 */
class Settings {
  constructor() {
    this.BUCKET_NAME = process.env.BUCKET_NAME;
  }
}

module.exports = new Settings();