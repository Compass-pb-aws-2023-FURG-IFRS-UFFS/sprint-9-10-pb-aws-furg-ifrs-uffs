const BaseException = require('../BaseException');
const {
    TWILIO_DEFAULT_ERROR,
    TWILIO_ACCESS_DENIED_ERROR,
    TWILIO_MESSAGE_NOT_FOUND_ERROR,
    TWILIO_MESSAGE_ACCESS_DENIED_ERROR,
    TWILIO_MESSAGE_NOT_READY_ERROR
} = require('../../core/exceptions');

class TwilioException extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TWILIO_DEFAULT_ERROR, 500);
  }

  /**
  * Creates a TwilioException for the given error code. If no exception is found an empty exception is returned
  * 
  * @param errorCode - The error code to look up
  * 
  * @return { TwilioException } The exception that was found or an empty exception if none was found in the
  */
  static handleTwilioException(errorCode) {
    const twilioExceptions = {
      AccessDenied: new TwilioAccessDeniedError(),
      MessageNotFoundError: new TwilioMessageNotFoundError(),
      MessageAccessDeniedError: new TwilioMessageAccessDeniedError(),
      MessageNotReadyError: new TwilioMessageNotReadyError(),
    };

    return twilioExceptions[errorCode] || new TwilioException();
  }
}

class TwilioAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TWILIO_ACCESS_DENIED_ERROR, 500);
  }
}

class TwilioMessageNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TWILIO_MESSAGE_NOT_FOUND_ERROR, 500);
  }
}

class TwilioMessageAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TWILIO_MESSAGE_ACCESS_DENIED_ERROR, 500);
  }
}

class TwilioMessageNotReadyError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || TWILIO_MESSAGE_NOT_READY_ERROR, 500);
  }
}

module.exports = {
    TwilioAccessDeniedError,
    TwilioMessageNotFoundError,
    TwilioMessageAccessDeniedError,
    TwilioMessageNotReadyError,
    TwilioException,
    handleTwilioException: TwilioException.handleTwilioException
};
