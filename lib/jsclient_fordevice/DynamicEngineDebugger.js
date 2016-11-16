
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
  __deDebuggerSocket.on('doReloadPage', function(){
      console.log('doReloadPage called');
      window.location.reload();
  });
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
          DEDebuggerHandler.___onFooEvent(msg);
      } else {
          console.log('Unandled message: ' + msg);
      }

  });


DEDebuggerHandler = {

    ___onFooEvent:function(message){
        NotificationManager._fireNotificationEvent("onNotificationWithAppActive", JSON.stringify(message));
    }

}
