import { Logger } from '../logger';

describe('Logger', () => {
  const testMessage = 'message';
  const testErrorStack = 'error';
  const extraFields = {
    some: 'field',
  };

  it('should log info message with correct fields', () => {
    Logger.info(testMessage);
    expect((Logger as any).logger.info).toHaveBeenCalledWith(testMessage, null);

    Logger.info(testMessage, null, extraFields);
    expect((Logger as any).logger.info).toHaveBeenCalledWith(testMessage, {
      ...extraFields,
    });
  });

  it('should log error message with correct fields', () => {
    Logger.error(testMessage);
    expect((Logger as any).logger.error).toHaveBeenCalledWith(
      testMessage,
      null,
    );

    Logger.error(testMessage, testErrorStack);
    expect((Logger as any).logger.error).toHaveBeenCalledWith(testMessage, {
      stack: testErrorStack,
    });
  });
});
