'use babel';
//import express from 'express'
var {allowUnsafeEval, allowUnsafeNewFunction} = require('loophole');
var express = allowUnsafeEval(() => require('express'));
var expressApp = express();
var http = require('http').Server(expressApp);
var io ;
var ProtocolHandler = require('./ProtocolHandler');
var logger = require('./loggers/logger');
var fs = require('fs');
var logger = require('./loggers/logger');
//var eventBus=require('./events/DEbuggerEventBus');

export default class DEDebugger {

  initialize(){
    //TODO create log dir?
    //var logDir = './logs';
  }

  startConnectionListening(settings){
    var that=this;
    io = require('socket.io')(http);
    io.on('connection', function(socket){
      var address = socket.handshake.address;
      logger.info("on debugger session connection for " + address);

      that.eventBus.publish("LOG", { 'message' : 'on debugger session connection'});
      that.socketList.push(socket);
      protocolHandler = new ProtocolHandler(socket,settings,that.eventBus);
      //var globalDebuggerConfig = this.createGlobalDebuggerConfig();
      protocolHandler.setupForDebug();

      socket.on('de_debug_hn_call', function(msg){
        //logger.debug("on debugger HN call: " + JSON.stringify(msg));
        that.eventBus.publish("LOG", { 'remoteCall' : msg });
        protocolHandler.handleRequest(msg);
      });

      socket.on('disconnect', function () {
        logger.debug("Device disconnected: from " + address);
        //that.socketList.splice(that.socketList.indexOf(socket), 1);
      });

      socket.on('deviceReady', function(msg){
        logger.debug("onDevice Ready: " + JSON.stringify(msg));
        socket.deviceInfo = msg;
        lastDeviceInfo = msg.deviceInfo;
        lastModelString = msg.modelString;
      });

      socket.on('close', function(socket){
        //socket.destroy();
        that.socketList.splice(that.socketList.indexOf(socket), 1);
      });

    });

    //this serves the client side static assets
    expressApp.use(express.static(this.settings.AssetPath, null));
    //this serves the client side debugger javascript
    /*expressApp.use('/__dedebugger', express.static(__dirname + '/jsclient'));*/

    expressApp.get('/__dedebugger/**', function(req,res){
      //req.header["user-agent"]
      var deInfoHeader = req.headers["x-requested-with"];
      var deDebugHeader = req.headers["dedebug-device-type"];
      var urlRelative = req.url;
      if (deInfoHeader ||
         that.settings.DebugOnDevice==true ||
         (deDebugHeader && deDebugHeader==="physical-device")
         ){
          logger.warn("[DEBUG-WARN] detect debugger in device");
          //this is a real device, send the DynamicEngineDebugger.js appropriate
          urlRelative = urlRelative.replace('/__dedebugger/' , '/jsclient_fordevice/');
          res.sendFile(__dirname + urlRelative);
      } else {
        logger.warn("[DEBUG-WARN] detect debugger in browser");
        urlRelative = urlRelative.replace('/__dedebugger/' , '/jsclient/');
        res.sendFile(__dirname + urlRelative);
      }
    });

    http.on('connection',function(socket){
      var thisSocket = socket;
      logger.info('HTTP socket opened ' + socket);
      that.httpSockets.push(socket);

      // Remove the socket when it closes
      thisSocket.on('close', function () {
        console.log('HTTP socket closed ' + that.thisSocket);
        delete that.thisSocket;
        that.httpSockets.splice(that.httpSockets.indexOf(socket), 1);
      });

    });

    http.listen(this.settings.DebugPort, function(){
      logger.info('Dynamic Engine Debugger listening on port ' + http.address().port);
      logger.info('Type "http://localhost:' + http.address().port +'" to start the app debugging.');
      //openChromeWindow();
      that.eventBus.publish("DEBUGGER_STARTED", { 'status' : 'started'});
    });

  }

  isRunning(){
    return http.listening;
  }

  constructor(eventBus){
    //this.settings=settings
    this.eventBus=eventBus;
    logger.info("Create debugger instance");
    this.socketList=[];
    this.httpSockets=[];
  }
  startDebugger(settings){
    this.settings=settings;
    console.log("startDebugger");
    this.startConnectionListening(settings);
  }
  stopDebugger(){
    console.log("stopDebugger")
    logger.info('Stopping the debugger server.');
    this.httpSockets.forEach(function(socket){
      socket.destroy();
    })
    //expressApp.close();
    io.httpServer.close();
    http.close();

    this.eventBus.publish("DEBUGGER_STOPPED", { 'status' : 'stopped'});
  }
  evaluateDebuggerCommand(command){
    if (command){
      if (command.name==="pushMessage") {
        protocolHandler.triggerRemotePushNotification(command.rest);
      } else if (command.name==="reload"){
        io.emit("doReloadPage", "{}");
      } else if (command.name==="eval"){
        io.emit("doEval", { script: command.rest });
      } else if (command.name==="reloadRemote"){
        io.emit("doEval", { script: 'DEDebuggerService.reload()' });
      } else {
        return { error:  "Unknown command: '" + command +"'" };
      }
    } else {
      return null;
    }
  }

}
