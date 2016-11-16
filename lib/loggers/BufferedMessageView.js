'use babel'
var MessagePanelView = require('atom-message-panel').MessagePanelView;

MessagePanelView.content=function(){
  this.div({
  class: 'am-panel tool-panel panel-bottom native-key-bindings',
  tabindex: '-1'
}, function () {
  this.div({
    class: 'panel-resize-handle',
    style: 'position: absolute; top: 0; left: 0; right: 0; height: 10px; cursor: row-resize; z-index: 3'
  });
  this.div({
    class: 'panel-heading'
  }, function () {
    this.div({
      class: 'heading-title inline-block',
      style: 'cursor: pointer',
      outlet: 'heading',
      click: 'toggle'
    });
    this.div({
      class: 'heading-summary inline-block',
      outlet: 'summary'
    });
    this.div({
      class: 'heading-buttoms inline-block pull-right'
    }, function () {
      this.div({
        class: 'heading-autoScroll inline-block icon-trashcan',
        style: 'cursor: pointer',
        outlet: 'btnClearConsole',
        click: 'clear'
      });
      this.div({
        class: 'heading-autoScroll inline-block icon-move-down',
        style: 'cursor: pointer',
        outlet: 'btnAutoScroll',
        click: 'toggleAutoScroll'
      });
      this.div({
        class: 'heading-fold inline-block icon-fold',
        style: 'cursor: pointer',
        outlet: 'btnFold',
        click: 'toggle'
      });
      this.div({
        class: 'heading-close inline-block icon-x',
        style: 'cursor: pointer;',
        outlet: 'btnClose',
        click: 'close'
      });
    }.bind(this));
  }.bind(this));
  this.div({
    class: 'panel-body padded',
    outlet: 'body',
    style: 'overflow-y: scroll;'
  });
}.bind(this));
}

const MAX_CONSOLE_MESSAGES= 500;
export default class BufferedMessageView extends MessagePanelView {
  constructor(params){
    super(params);
    this.slice=false;
  }
  add(msgView){
    //console.log(this.messages.length);
    var length=this.messages.length;
    if(length >= MAX_CONSOLE_MESSAGES || this.slice){
      this.slice=true;
      var toErase=this.messages[0];
      this.messages=this.messages.slice(0,1);
      //this.body.remove(toErase);
      this.body.removeAt(0);
    }
    super.add(msgView);
  }
  clear(){
    this.slice=false;
    super.clear();
  }

}
