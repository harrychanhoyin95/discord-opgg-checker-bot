import { Logger } from '~storage/logger';

// Removes logger from testing
(Logger as any).logger = {
  info: jest.fn(),
  error: jest.fn(),
};

require('jest-fetch-mock').enableMocks();
