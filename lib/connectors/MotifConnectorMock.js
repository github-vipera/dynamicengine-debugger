'use babel'
import logger from './../loggers/logger'
import Config from './../Config.js'
import NativeStorage from './../storage/NativeStorage'
import DEStorage from './../storage/DEStorage'
import MotifConnector from './MotifConnector'
import DEUtilities from './../DEUtilities'
import _ from 'lodash';
var mockImplementation=undefined;
export default class MotifConnectorMock extends MotifConnector {
  constructor(remoteURL,config){
    super(remoteURL);
    this.remoteURL=remoteURL;
    this.config=config;
  }
  sendRequest(request, callback){
    try {
          var app = request.req.app;
          var dom = request.req.dom;
          var op = request.req.op;
          var srv = request.req.srv;
          var objectToCall = null;
          var that = this;

          logger.debug("Sending request to MOTIF: " + JSON.stringify(request));

          objectToCall = mockImplementation[dom][app][srv];
          this.executeRequest(objectToCall, op, request, callback);

      } catch(ex){
          var errMsg = "MOTIF Mock Connector error: " + ex;
          if (ex.lineNumber){
              errMsg = errMsg + " (line:" + ex.lineNumber +")";
          }
          if (ex.fileName){
              errMsg = errMsg + " (line:" + ex.fileName +")";
          }
          logger.error(errMsg);
          //TODO!! reply with error
      }
  }
  executeRequest(objectToCall, operation, request, callback){
    var ret = (objectToCall[operation](request));
    if (callback){
        callback(ret);
    }
  }
  setupForDebug(params) {
      try {
          //mockImplementation = require(params.mockImplementationFilePath);
          if (mockImplementation==null){
              var path=this.config.MockImplementationPath;
              mockImplementation = require(path)(logger,  NativeStorage, DEStorage, DEUtilities, _);
              if (mockImplementation.appStarted) {
                  mockImplementation.appStarted();
              }
          }

      } catch(exx){
          logger.error(exx);
      }
  }
}
