'use strict';
import moment from 'moment';
import { configure, getLogger } from 'log4js';
import loggerConfig from '../../config/logger.config.js';

export class Logger {

  /**
   * @param logStr string to generate the log trace
   * @returns {Logger}
  */  
  
  static getLogger(logStr: string) {
    Logger.initLogger();
    return getLogger(logStr);
  }

  /**
    * Function that starts the execution by console and creation of log files 
    * @returns {void}  
   */
  static initLogger(): void {
    configure({
      appenders: {
        console: { type: 'stdout', layout: { type: 'colored' } },
        dateFile: {
          type: 'dateFile',
          filename: `${loggerConfig.path}/${loggerConfig.filename}_${moment().format('DD-MM-YYYY')}.log`,
          layout: { type: 'basic' },
          compress: true,
          keepFileExt: true,
        },
      },
      categories: {
        default: { appenders: ['console', 'dateFile'], level: 'info' },
      },
    });
  }
}
