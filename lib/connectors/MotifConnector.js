'use babel';
import logger from './../loggers/logger'
var unirest = require('unirest');
export default class MotifConnector {
  constructor(remoteURL){
    this.remoteURL=remoteURL;
  }
  sendRequest(request, callback) {

    logger.debug("Sending request to MOTIF: " + JSON.stringify(request));
    unirest.post(this.remoteURL)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(request)
        .end(function (response) {
            logger.debug("MOTIF Response : " + JSON.stringify(response.body));
            if (callback){
                callback(response.body);
            }
        });

  }
  setupForDebug(params) {
      //NOP
  }
}
