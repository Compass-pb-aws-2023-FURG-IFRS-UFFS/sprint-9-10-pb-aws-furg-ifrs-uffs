const { Rekognition } = require("@aws-sdk/client-rekognition");
const { BUCKET_NAME } = require("../core/config");

class RekognitionService {
  constructor() {
    this.rekognitionClient = new Rekognition();
  }

  async detectText(photo) {
    const rekognitionParams = {
      Image: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: photo,
        },
      },
    };

    const response = await this.rekognitionClient.detectText(rekognitionParams);
    const detectedTextArray = response.TextDetections.map((textDetection) => {
      if (textDetection.Type === "WORD") return textDetection.DetectedText;
    });
    const concatenatedText = detectedTextArray.join(" ");

    return concatenatedText.trim();
  }
}

module.exports = RekognitionService;
