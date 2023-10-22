const BaseException = require('../BaseException');
const {
    LEX_DEFAULT_ERROR,
    LEX_BOT_NOT_FOUND_ERROR,
    LEX_ACCESS_DENIED_ERROR,
    LEX_ALIAS_NOT_FOUND_ERROR,
    LEX_ALIAS_ACCESS_DENIED_ERROR,
    LEX_LOCALE_NOT_FOUND_ERROR,
    LEX_LOCALE_ACCESS_DENIED_ERROR,
    LEX_INTENT_NOT_FOUND_ERROR,
    LEX_INTENT_ACCESS_DENIED_ERROR,
    LEX_SLOT_NOT_FOUND_ERROR,
    LEX_SLOT_ACCESS_DENIED_ERROR,
    LEX_SESSION_NOT_FOUND_ERROR,
    LEX_SESSION_ACCESS_DENIED_ERROR,
    LEX_TEXT_NOT_FOUND_ERROR,
    LEX_TEXT_ACCESS_DENIED_ERROR,
    LEX_TRANSCRIPT_NOT_FOUND_ERROR,
    LEX_TRANSCRIPT_ACCESS_DENIED_ERROR,
    LEX_TRANSCRIPT_NOT_READY_ERROR
} = require('../../core/exceptions');

class LexException extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_DEFAULT_ERROR, 500);
  }

  /**
  * Converts an error code into a LexException. If the error code is not found in the exception table a new LexException is returned
  * 
  * @param errorCode - The error code to convert
  * 
  * @return { LexException } The exception that corresponds to
  */
  static handleLexException(errorCode) {
    const lexExceptions = {
      BotNotFoundError: new LexBotNotFoundError(),
      AccessDenied: new LexAccessDeniedError(),
      AliasNotFoundError: new LexAliasNotFoundError(),
      AliasAccessDeniedError: new LexAliasAccessDeniedError(),
      LocaleNotFoundError: new LexLocaleNotFoundError(),
      LocaleAccessDeniedError: new LexLocaleAccessDeniedError(),
      IntentNotFoundError: new LexIntentNotFoundError(),
      IntentAccessDeniedError: new LexIntentAccessDeniedError(),
      SlotNotFoundError: new LexSlotNotFoundError(),
      SlotAccessDeniedError: new LexSlotAccessDeniedError(),
      SessionNotFoundError: new LexSessionNotFoundError(),
      SessionAccessDeniedError: new LexSessionAccessDeniedError(),
      TextNotFoundError: new LexTextNotFoundError(),
      TextAccessDeniedError: new LexTextAccessDeniedError(),
      TranscriptNotFoundError: new LexTranscriptNotFoundError(),
      TranscriptAccessDeniedError: new LexTranscriptAccessDeniedError(),
      TranscriptNotReadyError: new LexTranscriptNotReadyError(),
    };

    return lexExceptions[errorCode] || new LexException();
  }
}

class LexBotNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_BOT_NOT_FOUND_ERROR, 500);
  }
}

class LexAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_ACCESS_DENIED_ERROR, 500);
  }
}

class LexAliasNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_ALIAS_NOT_FOUND_ERROR, 500);
  }
}

class LexAliasAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_ALIAS_ACCESS_DENIED_ERROR, 500);
  }
}

class LexLocaleNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_LOCALE_NOT_FOUND_ERROR, 500);
  }
}

class LexLocaleAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_LOCALE_ACCESS_DENIED_ERROR, 500);
  }
}

class LexIntentNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_INTENT_NOT_FOUND_ERROR, 500);
  }
}

class LexIntentAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_INTENT_ACCESS_DENIED_ERROR, 500);
  }
}

class LexSlotNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_SLOT_NOT_FOUND_ERROR, 500);
  }
}

class LexSlotAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_SLOT_ACCESS_DENIED_ERROR, 500);
  }
}

class LexSessionNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_SESSION_NOT_FOUND_ERROR, 500);
  }
}

class LexSessionAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_SESSION_ACCESS_DENIED_ERROR, 500);
  }
}

class LexTextNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_TEXT_NOT_FOUND_ERROR, 500);
  }
}

class LexTextAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_TEXT_ACCESS_DENIED_ERROR, 500);
  }
}

class LexTranscriptNotFoundError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_TRANSCRIPT_NOT_FOUND_ERROR, 500);
  }
}

class LexTranscriptAccessDeniedError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_TRANSCRIPT_ACCESS_DENIED_ERROR, 500);
  }
}

class LexTranscriptNotReadyError extends BaseException {
  /**
  * @param message
  */
  constructor(message) {
    super(message || LEX_TRANSCRIPT_NOT_READY_ERROR, 500);
  }
}

module.exports = {
    LexBotNotFoundError,
    LexAccessDeniedError,
    LexAliasNotFoundError,
    LexAliasAccessDeniedError,
    LexLocaleNotFoundError,
    LexLocaleAccessDeniedError,
    LexIntentNotFoundError,
    LexIntentAccessDeniedError,
    LexSlotNotFoundError,
    LexSlotAccessDeniedError,
    LexSessionNotFoundError,
    LexSessionAccessDeniedError,
    LexTextNotFoundError,
    LexTextAccessDeniedError,
    LexTranscriptNotFoundError,
    LexTranscriptAccessDeniedError,
    LexTranscriptNotReadyError,
    LexException,
    handleLexException: LexException.handleLexException
};
