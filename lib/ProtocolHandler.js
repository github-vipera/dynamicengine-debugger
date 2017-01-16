'use babel'
var winston = require('winston');
var logger = require('./loggers/logger');
var DeviceInfo = require('./DeviceInfo');
var reload = require('require-reload')(require);
var DEServerManagerController = require('./DEServerManagerController');
var NativeStorage;
export default class ProtocolHandler {
  constructor(socket,settings,eventBus){
    this.socket = socket;
    NativeStorage=reload('./storage/NativeStorage')(settings);
    this.serverManagerController = new DEServerManagerController(settings);
    this.eventBus=eventBus;
    this.subscribeForStop();
  }

  subscribeForStop(){
    this.eventBus.subscribe('DEBUGGER_STOPPED',() => {
      console.log("Receive stop of debugger");
      this.serverManagerController.clean();
    });
  }

  setupForDebug = function(params) {
    this.serverManagerController.setupForDebug(params);
  }

// class methods
  handleRequest = function(request) {
    //logger.debug("handle request called! " +  JSON.stringify(request));
    if (request.requestCommand === 'pageLoaded') {
        this.onPageLoaded(request);
    } else if (request.requestCommand === 'pageReady'){
            this.onPageReady(request);
    } else if (request.requestCommand === 'log'){
        this.onLog(request);
    } else if (request.requestCommand === 'contactRequest'){
        this.onContactRequest(request);
    } else if (request.requestCommand === 'getLocation'){
        this.onGetLocation(request);
    } else if (request.requestCommand === 'ExternalControllerService'){
        this.onExternalControllerServiceRequest(request);
    } else if (request.requestCommand === 'activatePush'){
        this.onActivatePushRequest(request);
    } else if (request.requestCommand === 'serverRequest'){
        this.onServerRequest(request);
    } else if (request.requestCommand === "getPreference") {
       this.onGetPreferences(request);
    } else if (request.requestCommand === "setPreference") {
       this.onSetPreferences(request);
    } else if (request.requestCommand === "removePreference") {
       this.onRemovePreference(request);
    } else {
        logger.warn("Unhandled request: " + JSON.stringify(request));
    }
  }

  onPageLoaded = function(request){
    var deviceInfo = this.buildDeviceInfo();
    var modelString = this.buildModelString();
    var initAppResp = {
        "modelString" : modelString,
        "deviceInfo" : deviceInfo
    };
    this.sendToHybrid('initApp', initAppResp);
  }

  onPageReady = function(request){
    logger.debug("pageReady called");
    //do nothing
  }


  onLog = function(request){
    logger.info("HLOG: " + request.params[0]);
  }

  sendToHybrid = function(command, params){
    var debuggerCall = {
        'requestCommand' : command,
        'params' : params
    };
    this.socket.emit('de_debug_nh_call', debuggerCall);
  }

  buildDeviceInfo = function(request) {
    return DeviceInfo.getDeviceInfo();
  }

  buildModelString = function(request) {
    return DeviceInfo.getModelString();
  }

  onServerRequest = function(request) {
    logger.debug("onServerRequest: " + JSON.stringify(request));
    var contextId = request.params[2];
    var serverRequest = JSON.parse(request.params[3]);
    var that = this;
    var requestData = {
        "requestData":  { data : serverRequest }
    };
    this.serverManagerController.sendData(requestData, function(resp, req){
        var responseData = {
            "contextId" : contextId,
            "responseData" : {
                "dataResult" : resp
            },
            "status" : "STATUS_OK"
        };
        that.sendToHybrid('DE.afterResponse', responseData);
    });

  }

  onExternalControllerServiceRequest(request) {
    logger.debug("externalControllerServiceRequest: " + JSON.stringify(request));
    var extConRequestStr = request.params[1];
    var extConRequest = JSON.parse(extConRequestStr);

    var serviceOperation = extConRequest.serviceOperation;
    var serviceName = extConRequest.requestData.controllerKey;

    var that = this;
    if (serviceName==="DEServerManagerController"){
        this.serverManagerController.sendData(extConRequest, function(resp, req){
            var requestKey = req.requestKey;
            var responseData = {
                "requestKey" : requestKey,
                "responseData" : {
                    "dataResult" : resp
                },
                "status" : "STATUS_OK"
            };
            that.sendToHybrid('DEBaseService.serviceResponse', responseData);
        });
    }

  }


  triggerRemotePushNotification(message, payload){
    var notificationReq = {
        aps : {
            alert: message,
            badge: 1,
            sound: "bingbong.aiff"
        },
        custom : {
            data: {
                alert: message,
                badge: 1,
                sound: "bingbong.aiff"
            }
        }
    };
    this.sendToHybrid('NotificationManager._fireNotificationEvent', notificationReq);
  }


// NATIVE MOCK REQUESTS

  onGetLocation = function(request) {
    this.sendToHybrid('getLocation', this.locationService.getLocation());
  }

//DEContactService
  onContactRequest(request) {
    var resp;
    var data;
    if (request.params[1]==="phoneNumber"){
        data = this.contactService.getPhoneNumber();
    } else {
        data = {};
    }
    resp = {
        "type" : request.params[1],
        "data" : data
    }
    this.sendToHybrid('contactRequest', resp);
  }


//DEContactService
  onActivatePushRequest(request) {
    var resp;
    var data;
    resp = {
        "type" : request.params[1],
        "data" : 'mock_token_12345678910'
    }
    this.sendToHybrid('NotificationManager.setPushToken', resp);
  }

  /**
  * getPreferences: get data by key
  */
  onGetPreferences(request){
    if(!(request.params && request.params["1"] != undefined)){
      logger.error("onGetPreferences called but params are illegal");
      return;
    }
    var key = request.params["1"];
    //logger.debug("read value from storage with key: " + key);
    NativeStorage.get(key,(value) => {
      var resp = {
          "key" : key,
          "value" : value
      };
      this.sendToHybrid("Communicator.sendPreferenceValue",resp);
    });
  }

  /**
  * getPreferences: get data by key
  */
  onSetPreferences(request){
    if(!(request.params && request.params["1"] != undefined && request.params["2"] != undefined)){
      logger.error("onSetPreferences called but params are illegal");
      return;
    }
    var key = request.params["1"];
    var value = request.params["2"];
    //logger.debug("read value from storage with key: " + key);
    NativeStorage.set(key,value);
  }

  onRemovePreference(request){
    if(!(request.params && request.params["1"] != undefined)){
      logger.error("onRemovePreference called but params are illegal");
      return;
    }
    var key = request.params["1"];
    NativeStorage.remove(key);
  }

}
