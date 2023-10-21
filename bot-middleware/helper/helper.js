const crypto = require("crypto");

/**
 * Creates a SHA256 hash of a string. Used to verify passwords before they are sent to the server
 *
 * @param str - The string to be hashed
 *
 * @return { string } The hash as a hex string of
 */
function createHash(str) {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}

function handleResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  };
}

function handleImage(extension, url) {
  // logic to handle images
  return "IMAGE MESSAGE RETURN";
}
function handleAudio(extension, url) {
  // logic to handle audio
  return "AUDIO MESSAGE RETURN";
}
module.exports = { handleImage, handleAudio, handleResponse, createHash };
