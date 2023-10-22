const BaseException = require("../BaseException");
const {
  POLLY_DEFAULT_ERROR,
    POLLY_ACCESS_DENIED_ERROR,
    POLLY_VOICE_NOT_FOUND_ERROR,
    POLLY_VOICE_ACCESS_DENIED_ERROR,
    POLLY_TEXT_NOT_FOUND_ERROR,
    POLLY_TEXT_ACCESS_DENIED_ERROR,
    POLLY_OUTPUT_NOT_FOUND_ERROR,
    POLLY_OUTPUT_ACCESS_DENIED_ERROR,
} = require("../../core/exceptions");

class PollyException extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || POLLY_DEFAULT_ERROR, 500);
  }

  /**
  * Converts an error code into a PollyException. If there is no exception the default exception is returned
  * 
  * @param errorCode - The error code to convert
  * 
  * @return { Exception } The exception that corresponds to the error code or the default exception if none could be found
  */
  static handlePollyException(errorCode) {
    const pollyExceptions = {
      AccessDenied: new PollyAccessDeniedError(),
      VoiceNotFoundError: new PollyVoiceNotFoundError(),
      VoiceAccessDeniedError: new PollyVoiceAccessDeniedError(),
      TextNotFoundError: new PollyTextNotFoundError(),
      TextAccessDeniedError: new PollyTextAccessDeniedError(),
      OutputNotFoundError: new PollyOutputNotFoundError(),
      OutputAccessDeniedError: new PollyOutputAccessDeniedError(),
    };

    return pollyExceptions[errorCode] || new PollyException();
  }
}

class PollyAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || POLLY_ACCESS_DENIED_ERROR, 500);
  }
}

class PollyVoiceNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || POLLY_VOICE_NOT_FOUND_ERROR, 500);
  }
}

class PollyVoiceAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || POLLY_VOICE_ACCESS_DENIED_ERROR, 500);
  }
}

class PollyTextNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || POLLY_TEXT_NOT_FOUND_ERROR, 500);
  }
}

class PollyTextAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || POLLY_TEXT_ACCESS_DENIED_ERROR, 500);
  }
}

class PollyOutputNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || POLLY_OUTPUT_NOT_FOUND_ERROR, 500);
  }
}

class PollyOutputAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || POLLY_OUTPUT_ACCESS_DENIED_ERROR, 500);
  }
}

module.exports = {
  PollyException,
  PollyAccessDeniedError,
  PollyVoiceNotFoundError,
  PollyVoiceAccessDeniedError,
  PollyTextNotFoundError,
  PollyTextAccessDeniedError,
  PollyOutputNotFoundError,
  PollyOutputAccessDeniedError,
  handlePollyException: PollyException.handlePollyException,
};
