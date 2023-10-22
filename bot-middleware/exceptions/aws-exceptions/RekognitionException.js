const BaseException = require('../BaseException');
const {
    REKOGNITION_DEFAULT_ERROR,
    REKOGNITION_ACCESS_DENIED_ERROR,
    REKOGNITION_IMAGE_NOT_FOUND_ERROR,
    REKOGNITION_IMAGE_ACCESS_DENIED_ERROR,
    REKOGNITION_IMAGE_NOT_READY_ERROR
} = require('../../core/exceptions');

class RekognitionException extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || REKOGNITION_DEFAULT_ERROR, 500);
  }

  /**
  * Converts an error code into a RekognitionException. If there is no exception it will return an empty exception
  * 
  * @param errorCode - The error code to convert.
  * 
  * @return { RekognitionException } The exception that corresponds to the error code. If none is found a new exception will be returned
  */
  static handleRekognitionException(errorCode) {
    const rekognitionExceptions = {
      AccessDenied: new RekognitionAccessDeniedError(),
      ImageNotFoundError: new RekognitionImageNotFoundError(),
      ImageAccessDeniedError: new RekognitionImageAccessDeniedError(),
      ImageNotReadyError: new RekognitionImageNotReadyError(),
    };

    return rekognitionExceptions[errorCode] || new RekognitionException();
  }
}

class RekognitionAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || REKOGNITION_ACCESS_DENIED_ERROR, 500);
  }
}

class RekognitionImageNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || REKOGNITION_IMAGE_NOT_FOUND_ERROR, 500);
  }
}

class RekognitionImageAccessDeniedError extends BaseException {
  /**
  */
  constructor(message) {
    super(message || REKOGNITION_IMAGE_ACCESS_DENIED_ERROR, 500);
  }
}

class RekognitionImageNotReadyError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || REKOGNITION_IMAGE_NOT_READY_ERROR, 500);
  }
}

module.exports = {
    RekognitionAccessDeniedError,
    RekognitionImageNotFoundError,
    RekognitionImageAccessDeniedError,
    RekognitionImageNotReadyError,
    RekognitionException,
    handleRekognitionException: RekognitionException.handleRekognitionException
};
