const { createLogger, transports, format } = require('winston');

const { combine, printf, timestamp: timeStampFormatter } = format;

module.exports = class Logger {
  // Initialize the logger
  static init() {
    this.logger = createLogger({});
    const customFormat = printf(
      ({ level, message, timestamp, ...rest }) =>
        `${timestamp} ${level}: ${message} ${JSON.stringify(rest)}`
    );

    const consoleTransport = new transports.Console({
      level: 'info',
      format: combine(timeStampFormatter(), customFormat),
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(consoleTransport);
      this.logger.exceptions.handle(consoleTransport);
    }
  }

  // Logs general info
  static info(message, author = null, extraFields = null) {
    this.logger.info(
      message,
      Logger.mergeLoggerObjects(null, author, extraFields)
    );
  }

  // Logs error
  static error(message, errorStack, author = null, extraFields = null) {
    this.logger.error(
      message,
      Logger.mergeLoggerObjects(errorStack, author, extraFields)
    );
  }

  // Merge author, error and custom properties for logger to print as 'rest'
  static mergeLoggerObjects(
    errorStack = null,
    author = null,
    extraFields = null
  ) {
    const authorObj = author ? { author } : null;
    const extraFieldsObj = extraFields || {};
    const errorStackObj = errorStack ? { stack: errorStack } : null;

    const mergeLoggerObjects = {
      ...authorObj,
      ...extraFieldsObj,
      ...errorStackObj,
    };

    return Object.keys(mergeLoggerObjects).length === 0
      ? null
      : mergeLoggerObjects;
  }
};
