// colocar esse pedaço de código no arquivo Util.js
const crypto = require("crypto");

function createHash(str) {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}

module.exports = { createHash };