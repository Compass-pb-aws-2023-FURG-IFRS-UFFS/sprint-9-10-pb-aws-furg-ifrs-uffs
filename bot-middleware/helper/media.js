const S3Service = require("../services/S3Service")

async function handleImage(url,extension) {
  // logic to handle images
  console.log("extensao");
  console.log(extension);
  console.log("URL");
  console.log(url);
  console.log("Entrou no handle image");
  const bucketKey = await new S3Service().saveToS3(url, extension);
  console.log(bucketKey);
  return bucketKey;
}

async function handleAudio(url,extension) {
  // logic to handle audio
  const bucketKey = await new S3Service().saveToS3(url, extension);
  console.log(bucketKey);
  return bucketKey;
}

module.exports = { handleImage, handleAudio };