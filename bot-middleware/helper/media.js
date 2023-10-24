const S3Service = require("../services/S3Service");
const TranscribeService = require("../services/TranscribeService");
const RekognitionService = require("../services/RekognitionService");
const { BUCKET_NAME } = require("../core/config");

async function handleImage(url, extension) {
  // logic to handle images
  console.log("extensao");
  console.log(extension);
  console.log("URL");
  console.log(url);
  console.log("Entrou no handle image");
  const bucketKey = await new S3Service().saveToS3(url, extension);
  console.log(bucketKey);
  const text = await new RekognitionService().detectText(bucketKey);
  console.log(text);
  return text;
}

async function handleAudio(url, extension) {
  // logic to handle audio
  const bucketKey = await new S3Service().saveToS3(url, extension);
  console.log(bucketKey);
  const transcribeService = new TranscribeService();
  const transcribeResponse = await transcribeService.transcribeMessage(
    `s3://${BUCKET_NAME}/${bucketKey}`
  );
  console.log(transcribeResponse);
  return bucketKey;
}

module.exports = { handleImage, handleAudio };
