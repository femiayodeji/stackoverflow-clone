import logger from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation(() => logger);
    jest.spyOn(logger, 'error').mockImplementation(() => logger);
    jest.spyOn(logger, 'warn').mockImplementation(() => logger);
  });

  afterEach(() => jest.restoreAllMocks());

  it('should call logger.info with message and meta', () => {
    logger.info('test info message', { userId: 1 });
    expect(logger.info).toHaveBeenCalledWith('test info message', { userId: 1 });
  });

  it('should call logger.error with message and stack', () => {
    const error = new Error('something broke');
    logger.error('db error', { stack: error.stack });
    expect(logger.error).toHaveBeenCalledWith('db error', { stack: error.stack });
  });

  it('should call logger.warn with message', () => {
    logger.warn('low disk space');
    expect(logger.warn).toHaveBeenCalledWith('low disk space');
  });

  it('should be silent in test environment', () => {
    expect(logger.silent).toBe(true);
  });
});