import { ILogger } from "../interfaces/ILogger.js";
import { injectable } from "tsyringe";
import log4js from 'log4js';

// Configuración básica de log4js
log4js.configure({
  appenders: {
    console: { type: 'stdout', layout: { type: 'colored' } },
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
  },
});

@injectable()
export class Log4jsLogger implements ILogger {
  private logger: log4js.Logger;

  constructor() {
    this.logger = log4js.getLogger();
  }

  info(message: string, ...args: never[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: never[]): void {
    this.logger.warn(message, ...args);
  }

  error(message: string, ...args: never[]): void {
    this.logger.error(message, ...args);
  }

  debug(message: string, ...args: never[]): void {
    this.logger.debug(message, ...args);
  }
}
