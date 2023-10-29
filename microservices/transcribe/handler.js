const transcribeService = require('./services/TranscribeService');

function getTranscription(event, context, callback){
    const audio = JSON.parse(event.body).body;
    try {
        const transcribe = new transcribeService();
        return transcribe.transcribeMessage(audio); // audio == `s3://${BUCKET_NAME}/${bucketKey}`
    } catch (err) {
        console.log(err);
        throw new Error("Error in Amazon Transcribe: " + err);
    }
}

module.exports = { getTranscription };