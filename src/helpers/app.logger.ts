import { Injectable, LoggerService } from '@nestjs/common';
import { FileHelper } from './file-system/file-helper';

@Injectable()
export class AppLogger implements LoggerService {
  constructor(private readonly fileHelper: FileHelper) {}
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.fileHelper.log('app', { message, optionalParams });
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.fileHelper.log('app', { message, optionalParams });
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.fileHelper.log('app', { message, optionalParams });
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    this.fileHelper.log('app', { message, optionalParams });
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    this.fileHelper.log('app', { message, optionalParams });
  }
}
