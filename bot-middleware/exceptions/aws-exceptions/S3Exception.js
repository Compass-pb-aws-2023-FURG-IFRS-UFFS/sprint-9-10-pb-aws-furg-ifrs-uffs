const BaseException = require("../BaseException");
const {
  S3_DEFAULT_ERROR,
  S3_BUCKET_NOT_FOUND_ERROR,
  S3_ACCESS_DENIED_ERROR,
  S3_KEY_NOT_FOUND_ERROR,
  S3_KEY_ACCESS_DENIED_ERROR,
  S3_FILE_NOT_FOUND_ERROR,
  S3_FILE_ACCESS_DENIED_ERROR,
  S3_EXCEPTION,
} = require("../../core/exceptions");

class S3Exception extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || S3_EXCEPTION, 500);
  }

  /**
  * Converts an error code into an S3Exception. If there is no exception a default is returned.
  * 
  * @param errorCode - The error code to convert. May be a negative integer or a string that maps to a known error code.
  * 
  * @return { S3Exception } The exception that corresponds to the error code or an empty exception if none could be found
  */
  static handleS3Exception(errorCode) {
    const s3Exceptions = {
      AccessDenied: new S3AccessDeniedError(),
      BucketNotFoundError: new S3BucketNotFoundError(),
      FileAccessDenied: new S3FileAccessDeniedError(),
      FileNotFoundError: new S3FileNotFoundError(),
      KeyAccessDenied: new S3KeyAccessDeniedError(),
      KeyNotFoundError: new S3KeyNotFoundError(),
      NoSuchBucket: new S3BucketNotFoundError(),
    };

    return s3Exceptions[errorCode] || new S3Exception();
  }
}

class S3DefaultError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || S3_DEFAULT_ERROR, 500);
  }
}

class S3BucketNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message ||S3_BUCKET_NOT_FOUND_ERROR, 404);
  }
}

class S3AccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || S3_ACCESS_DENIED_ERROR, 403);
  }
}

class S3KeyNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || S3_KEY_NOT_FOUND_ERROR, 404);
  }
}

class S3KeyAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || S3_KEY_ACCESS_DENIED_ERROR, 403);
  }
}

class S3FileNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || S3_FILE_NOT_FOUND_ERROR, 404);
  }
}

class S3FileAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || S3_FILE_ACCESS_DENIED_ERROR, 403);
  }
}

module.exports = {
  S3Exception,
  S3DefaultError,
  S3BucketNotFoundError,
  S3AccessDeniedError,
  S3KeyNotFoundError,
  S3KeyAccessDeniedError,
  S3FileNotFoundError,
  S3FileAccessDeniedError,
  handleS3Exception: S3Exception.handleS3Exception,
};
