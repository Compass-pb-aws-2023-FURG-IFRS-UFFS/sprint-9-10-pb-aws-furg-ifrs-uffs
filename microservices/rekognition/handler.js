const RekognitionService = require("./services/RekognitionService");

function handler(event, context, callback) {
  const image = JSON.parse(event.body).image;
  const rekognitionService = new RekognitionService();
  return rekognitionService.toText(image);
}

module.exports = { handler };
