import { Global, Module } from '@nestjs/common';

import { LOGGER } from '../../di/injection-tokens.js';

import { Log4jsLogger } from './logger.js';

@Global()
@Module({
  providers: [{ provide: LOGGER, useClass: Log4jsLogger }],
  exports: [LOGGER],
})
export class LoggerModule {}
