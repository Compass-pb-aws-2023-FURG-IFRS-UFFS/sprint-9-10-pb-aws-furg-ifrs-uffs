const { BUCKET_NAME } = require("../core/config")

const crypto = require("crypto")

/**
 * Creates a SHA256 hash of a string. Used to verify passwords before they are sent to the server
 *
 * @param {string} str - The string to be hashed
 * @return { string } The hash as a hex string of
 */
function createHash(str) {
  const hash = crypto.createHash("sha256")
  hash.update(str)
  return hash.digest("hex")
}

/**
 * Generates an HTTP response object with the specified status code and message.
 *
 * @param {number} statusCode - The HTTP status code of the response.
 * @param {string} message - The message to be included in the response body.
 * @returns {Object} - An HTTP response object.
 */
function handleResponse(statusCode, message) {
  /**
  * HTTP response object.
  * @typedef {Object} HttpResponse
  * @property {number} statusCode - The HTTP status code.
  * @property {Object} headers - The headers for the response.
  * @property {string} headers.Access-Control-Allow-Origin - CORS header allowing any origin.
  * @property {string} headers.Content-Type - Content type header set to application/json.
  * @property {string} body - The response body in JSON format.
  */

  /**
   * @type {HttpResponse}
   */
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body: message }),
  }
}

/**
 * Checks if the provided URL contains an audio file from the specified S3 bucket.
 *
 * @param {string} url - The URL to be checked.
 * @returns {RegExpExecArray | null} A RegExpExecArray if a match is found, or null if no match is found.
 */
function containAudio(url) {
  const regex = new RegExp(`https:\\/\\/s3\\.us-east-1\\.amazonaws\\.com\\/${BUCKET_NAME}\\/[a-zA-Z\\d\\-_]{0,}\\.mp3`)

  return regex.exec(url) ?? ""
}
module.exports = { handleResponse, createHash, containAudio }
