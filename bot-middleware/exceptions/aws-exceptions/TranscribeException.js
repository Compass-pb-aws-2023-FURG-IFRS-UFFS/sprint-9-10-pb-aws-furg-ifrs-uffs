const BaseException = require("../BaseException");
const {
    TRANSCRIBE_DEFAULT_ERROR,
    TRANSCRIBE_ACCESS_DENIED_ERROR,
    TRANSCRIBE_JOB_NOT_FOUND_ERROR,
    TRANSCRIBE_JOB_ACCESS_DENIED_ERROR,
    TRANSCRIBE_JOB_NOT_READY_ERROR
} = require("../../core/exceptions");

class TranscribeException extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TRANSCRIBE_DEFAULT_ERROR, 500);
  }

  /**
  * Converts an error code into a TranscribeException. If none of the error codes are found an empty exception is returned
  * 
  * @param errorCode - The error code to convert
  * 
  * @return { Exception } The exception that corresponds to the error code or an empty exception if none of the error codes are
  */
  static handleTranscribeException(errorCode) {
    const transcribeExceptions = {
      AccessDenied: new TranscribeAccessDeniedError(),
      JobNotFoundError: new TranscribeJobNotFoundError(),
      JobAccessDeniedError: new TranscribeJobAccessDeniedError(),
      JobNotReadyError: new TranscribeJobNotReadyError(),
    };

    return transcribeExceptions[errorCode] || new TranscribeException();
  }
}

class TranscribeAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TRANSCRIBE_ACCESS_DENIED_ERROR, 500);
  }
}

class TranscribeJobNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TRANSCRIBE_JOB_NOT_FOUND_ERROR, 500);
  }
}

class TranscribeJobAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TRANSCRIBE_JOB_ACCESS_DENIED_ERROR, 500);
  }
}

class TranscribeJobNotReadyError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TRANSCRIBE_JOB_NOT_READY_ERROR, 500);
  }
}

module.exports = {
    TranscribeAccessDeniedError,
    TranscribeJobNotFoundError,
    TranscribeJobAccessDeniedError,
    TranscribeJobNotReadyError,
    TranscribeException,
    handleTranscribeException: TranscribeException.handleTranscribeException
};

