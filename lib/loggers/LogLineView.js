'use babel'
var LineMessageView = require('atom-message-panel').LineMessageView;
export default class LogLineMessage extends LineMessageView {
  constructor(params){
    super(params);
    this.level=params.level;
  }
  initialize(){
    /*var message = 'at line ' + this.line;
    if (this.character !== undefined) {
      message += ', character ' + this.character;
    }
    if (this.file !== undefined) {
      message += ', file ' + this.file;
    }*/
    /*var message="";
    //var message="[" + this.level +  "]";
    this.position.text(message);*/
    this.contents.text(this.message);
    if (this.className) {
      this.contents.addClass(this.className);
    }

    if (this.preview) {
      this.code.text(this.preview);
    } else {
      this.code.remove();
    }
  }

  updateLogLevel(){
    var message="[" + this.level +  "]";
    this.position.text(message);
    switch (this.level) {
      case 'debug':
        break;
      case 'info':
        this.position[0].style.color="green";
        this.contents[0].style.color="green"
        break;
      case 'warn':
        this.position[0].style.color="orange";
        this.contents[0].style.color="orange";
        break;
      case 'error':
        this.position[0].style.color="red";
        this.contents[0].style.color="red";
      default:

    }
  }

}
