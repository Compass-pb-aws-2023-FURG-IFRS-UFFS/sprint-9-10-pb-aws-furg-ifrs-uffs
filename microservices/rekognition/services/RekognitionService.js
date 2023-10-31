const { Rekognition } = require("@aws-sdk/client-rekognition");
const { BUCKET_NAME } = require("../core/config");

/**
 * Service for using AWS Rekognition to extract text from images.
 */
class RekognitionService {
  constructor() {
    this.rekognitionClient = new Rekognition();
  }

  /**
   * Extracts text from an image stored in an S3 bucket.
   *
   * @param {string} photo - The name of the image file in the S3 bucket.
   * @returns {Promise<string>} A Promise that resolves to the extracted text.
   */
  async toText(photo) {
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
