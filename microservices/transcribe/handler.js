const transcribeService = require('./services/TranscribeService');

function getTranscription(event, context, callback){
    const transcribe = new transcribeService();
    return transcribe.transcribeMessage(event);
}