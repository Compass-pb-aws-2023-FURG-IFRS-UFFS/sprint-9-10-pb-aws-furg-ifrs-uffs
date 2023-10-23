const axios = require('axios');
const TwilioService = require("./TwilioService")

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { BUCKET_NAME } = require("../core/config")
const { createHash } = require("../helper/helper")

const s3Client = new S3Client();
const twilioService = new TwilioService();

class S3Service {
    constructor() {
        this.s3Client = new S3Client();
    }
    async saveToS3(url, extension) {
      try{
        const date = new Date().toString()
        const hash = createHash(date);
        const body = await twilioService.handleDownload(url);
        const bucketKey = hash + "." + extension
        const input = { 
            Body: body,
            Bucket: BUCKET_NAME, 
            Key: bucketKey,
        };
        const command = new PutObjectCommand(input);
        s3Client.send(command);
        console.log('Image saved successfully!');
        return bucketKey
      }catch (error) {
        console.error(error);
      }   
    }
  }
module.exports = S3Service;