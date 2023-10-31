const transcribeService = require("./services/TranscribeService");

/**
 * AWS Lambda function for transcribing audio using TranscribeService.
 *
 * @param {object} event - The Lambda event object.
 * @param {object} context - The Lambda context object.
 * @param {function} callback - The callback function.
 * @returns {Promise<object>} - A Promise representing the Lambda response.
 */
async function getTranscription(event, context, callback) {
  const audio = JSON.parse(event.body).body;
  try {
    const transcribe = new transcribeService();
    const url = await transcribe.transcribeMessage(audio);
    console.log(url);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        response: url,
      }),
    };
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Error in Amazon Transcribe: " + err);
  }
}

module.exports = { getTranscription };