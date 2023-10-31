const RekognitionService = require("./services/RekognitionService");

/**
 * Lambda function handler for processing an image using RekognitionService.
 *
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @param {function} callback - The callback function.
 * @returns {Promise} - A Promise representing the result of the image processing.
 */
function handler(event, context, callback) {
  const image = JSON.parse(event.body).image;
  const rekognitionService = new RekognitionService();
  return rekognitionService.toText(image);
}

module.exports = { handler };