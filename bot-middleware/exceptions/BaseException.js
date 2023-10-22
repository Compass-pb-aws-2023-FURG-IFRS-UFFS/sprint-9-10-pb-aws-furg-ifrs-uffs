class BaseException extends Error {
    /**
    * Constructs an Error with a message. Intended for use with redux - cli. This is the constructor for the most common use case.
    * 
    * @param message - The message to set in the error. Can be null
    */
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = BaseException;
