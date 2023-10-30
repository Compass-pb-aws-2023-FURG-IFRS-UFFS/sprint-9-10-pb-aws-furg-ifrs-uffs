const { BUCKET_NAME } = require("../core/config")
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const { createHash } = require("../helper/helper")

/**
 * Service for interactions with Amazon S3.
 * @class
 * @author John Marcel
 */
class S3Service {

  constructor() {
     /**
     * Client for interactions with Amazon S3.
     * @type {S3Client}
     */
    this.s3Client = new S3Client()
  }

  /**
   * Saves a file to Amazon S3.
   *
   * @param {Buffer} body - The content of the file to be saved.
   * @param {string} extension - The extension of the file to be saved.
   * @returns {Promise<string>} - The key of the object saved in S3.
   * @throws {Error} - Throws an error if there is a problem saving the file.
   */
  async saveToS3(body, extension) {
    try {
       // Generate a unique hash based on the current date
      const date = new Date().toString()
      const hash = createHash(date)
      const bucketKey = `${hash}.${extension}`

      // Prepare input parameters for PutObjectCommand
      const input = {
        Body: body,
        Bucket: BUCKET_NAME,
        Key: bucketKey,
      }

      // Create a command to put the object into S3 bucket
      const command = new PutObjectCommand(input)

       // Send the command to S3 service to save the file
      await this.s3Client.send(command)

      // Log success message and return the generated bucket key
      console.log("Image saved successfully!")
      return bucketKey
    } catch (error) {
      throw new Error("Error occurred while saving the file to S3 bucket.");
    }
  }
}
module.exports = S3Service
