'use babel'
import logger from './loggers/logger.js'
export default class DEUtilities {
  static log(message){
    logger.debug(message);
  }

  constructor() {

  }
};
