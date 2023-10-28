const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { BUCKET_NAME } = require("../core/config");
const { createHash } = require("../helper/helper");

class S3Service {
  constructor() {
    this.s3Client = new S3Client();
  }
  async saveToS3(body, extension) {
    try {
      const date = new Date().toString();
      const hash = createHash(date);
      const bucketKey = `${hash}.${extension}`;
      const input = {
        Body: body,
        Bucket: BUCKET_NAME,
        Key: bucketKey,
      };
      const command = new PutObjectCommand(input);
      await this.s3Client.send(command);
      console.log("Image saved successfully!");
      return bucketKey;
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = S3Service;
