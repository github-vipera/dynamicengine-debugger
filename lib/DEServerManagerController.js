'use babel'
var logger = require('./loggers/logger');
var Config = require('./Config.js');
export default class DEServerManagerController {
  constructor(settings){
    this.config=settings;
    this.createMotifConnector();
  }
  createMotifConnector(){
    var serverURL=this.config.RemoteServerUrl;
    var useMock=this.config.MockImplementationPath || false;
    logger.info("DEServerManagerController MOTIF URL: " + serverURL);
    var Clazz=undefined
    if(!useMock){
      Clazz = require('./connectors/MotifConnector');
      this.motifConnection=new Clazz(serverURL,this.config);
    }else{
      Clazz = require('./connectors/MotifConnectorMock');
      this.motifConnection=new Clazz(serverURL,this.config);
    }
  }

  // class methods
  sendData = function(request, callback) {
    this.motifConnection.sendRequest(request.requestData.data, function(resp){
        callback(resp, request);
    });
  }

  setupForDebug = function(params) {
    this.motifConnection.setupForDebug(params);
  }


}
