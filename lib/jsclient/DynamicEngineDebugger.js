

  var __deDebuggerSocket = io();
  __deDebuggerSocket.on('connection', function(socket){
    console.log('a user connected');
  });
  __deDebuggerSocket.on('disconnect', function(){
    console.log('user disconnected');
  });
  __deDebuggerSocket.on('debuggerReady', function(){
      console.log('debuggerReady called');
  });
  /*
  __deDebuggerSocket.on('doReloadPage', function(){
      console.log('doReloadPage called');
      window.location.reload();
  });
  __deDebuggerSocket.on('doReloadPage', function(){
      console.log('doReloadPage called');
      window.location.reload();
  });
  */
  __deDebuggerSocket.on('doEval', function(message){
      console.log('doEval called');
      var scriptStr = message.script;
      eval(scriptStr);
      console.log('doEval done');
  });



  document.addEventListener("DEReady", function(){
      __deDebuggerSocket.emit("deviceReady", { deviceInfo: DeviceInfo, modelString: DEStorage.get("dev_api_model") });
  });

  __deDebuggerSocket.on('de_debug_nh_call', function(msg){
      console.log('debugger message: ' + msg);
      if (msg.requestCommand==='initApp'){
        initApp(msg.params.modelString, msg.params.deviceInfo);
      }
      else if (msg.requestCommand==='contactRequest'){
        DEDebuggerHandler.___onContactRequestResp(msg);
      }
      else if (msg.requestCommand==='getLocation'){
        DEDebuggerHandler.___onGetLocationResp(msg);
      } else if (msg.requestCommand==='DEBaseService.serviceResponse'){
        DEDebuggerHandler.___onDEBaseService_serviceResponse(msg);
      } else if (msg.requestCommand==='NotificationManager.setPushToken'){
          DEDebuggerHandler.___onNotificationManager_setPushToken(msg);
      } else if (msg.requestCommand==='DE.afterResponse'){
          DEDebuggerHandler.___onServerAfterResponse(msg);
      } else if (msg.requestCommand==='NotificationManager._fireNotificationEvent'){
          DEDebuggerHandler.___onFireNotificationEvent(msg);
      } else {
          console.log('Unandled message: ' + msg);
      }


  });

  DEDebuggerService = {};
  DEDebuggerService.reload = function(){
      window.location.reload();
  }

  Communicator.nativeRequest = function(requestCommand) {
          if (typeof requestCommand ==
              "undefined") return;
          var argumentsString = "";
          if (arguments.length > 1)
              for (var i = 1; i < arguments.length; i++){
                  if (this.base64Communication) argumentsString += Config.parameterSeparator + Base64.encode(arguments[i]);
              else argumentsString += Config.parameterSeparator + arguments[i];
              }
      var hnRequest = {
          'requestCommand' : requestCommand,
          'params' : arguments
      }
      __deDebuggerSocket.emit('de_debug_hn_call', hnRequest);
  };

  Utilities = {
      log: function(message) {
          var hnRequest = {
              'requestCommand' : "log",
              'params' : [ message ]
          }
          __deDebuggerSocket.emit('de_debug_hn_call', hnRequest);
          console.log(message);
      }

  };


DEDebuggerHandler = {
  ___onContactRequestResp : function(message){
    Utilities.log("received contactRequest response: " + JSON.stringify(message));
    DEContactService.contactRequestExecuted(JSON.stringify(message.params.data));
  },
  ___onGetLocationResp : function(message){
    Communicator.newLocation(message.params.coords[0], message.params.coords[1]);
  },
  ___onDEBaseService_serviceResponse : function(message){
    //Utilities.log("___onDEBaseService_serviceResponse received!");
    DEBaseService.serviceResponse(message.params);
  },
    ___onNotificationManager_setPushToken : function (message){
      NotificationManager.setPushToken(message.params.data);
    },

    ___onServerAfterResponse:function(message){
         Controller[message.params.contextId].afterResponse(message.params.responseData.dataResult);
    },

    ___onFireNotificationEvent:function(message){
        NotificationManager._fireNotificationEvent("onNotificationWithAppActive", JSON.stringify(message));
    }

}
