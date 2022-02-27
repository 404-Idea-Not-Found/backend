class ErrorWithStatus extends Error {
  constructor(originalError, statusCode, result, errMessage) {
    if (process.env.NODE_ENV === "development" && originalError) {
      super(originalError.message);
    } else if (process.env.NODE_ENV === "development" && !originalError) {
      super(errMessage);
    } else {
      super(errMessage);
      this.stack = null;
    }

    this.status = statusCode;
    this.result = result;
    Error.captureStackTrace(this, this.constructor);
  }

  toPlainSocketErrorObject() {
    return {
      data: this.status,
      status: this.status,
      result: this.result,
      errMessage: this.message,
    };
  }
}

module.exports = ErrorWithStatus;
