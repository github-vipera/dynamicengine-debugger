'use babel'
import BufferedMessageView from './BufferedMessageView'
import LogLineMessage from './LogLineView'
var MessagePanelView = require('atom-message-panel').MessagePanelView,
    PlainMessageView = require('atom-message-panel').PlainMessageView,
    LineMessageView = require('atom-message-panel').LineMessageView;
//var eventBus=require('./../events/DEbuggerEventBus');
export default class ConsoleHandler{
  constructor(eventBus){
    this.messageView=undefined;
    this.createMessagePanelView();
    this.eventBus=eventBus;
  }

  setLogger(logger){
    var that=this;
    logger.on('logging', function (transport, level, msg, meta) {
        // [msg] and [meta] have now been logged at [level] to [transport]
        //console.log("level:",level);
        that.log(msg,{level:level})
        if (that.eventBus){
          that.eventBus.publish("LOG", { 'message' : msg});
        }
    });
  }

  createMessagePanelView(){
    this.messageView = new BufferedMessageView({
      title: 'DEDebugger console attached'
    });
    this.messageView.attach();
  }

  attach(){
    this.messageView.attach();
  }

  log(msg,options){
    var logLine=new LogLineMessage({
      message:msg,
      level:options.level
    });
    logLine.updateLogLevel();
    this.messageView.add(logLine);
    this.messageView.body.scrollTop(1E10);
  }
}
