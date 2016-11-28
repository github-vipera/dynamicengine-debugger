'use babel';
const Pane = require('atom-quick-pane');
import $ from "JQuery";
var exec = require('child_process').exec;
var kill = require('tree-kill');
var scriptPanelDef=require("./views/dynamicengine-debugger-script-tools-view.js");
export default class ScriptTools {
  scriptPanel=undefined;
  constructor(logger,container){
    this.logger=logger;
    if(container){
      container.innerHTML += scriptPanelDef.render();
      this.bindJS();
    }else{
      this._createPane(scriptPanelDef);
    }
  }
  _createPane(scriptPanelDef){
    this.scriptPanelPromise = Pane({
      element: 'div',
      title: 'script support tools',
      split: 'right',
      activatePane: true
    }, (err, div) => {
      if (err) throw err
      div.innerHTML = scriptPanelDef.render();
      this.bindJS();
    }, () => {
      // clean up any event listeners or other resources here
      this.settingsPanel = undefined;
    });
    this.scriptPanelPromise.then((value)=>{
      console.log("scriptPanelPromise ok");
    },function(){
      console.error("scriptPanelPromise error");
    });
  }

  bindJS(){
    console.log("bindJS");
    document.getElementById('script-btn-run').addEventListener("click",()=>{
      //this.handleRunDevScript();
      this.handleRunWithSpawn();
    });
    document.getElementById('script-btn-stop').addEventListener("click",()=>{
      this.handleStopDevScript();
    });
  }
  handleRunDevScript(){
    console.log("handleRunDevScript");
    var path=atom.project.getPaths()[0];
    var cmd="npm run dev" ;
    try{
      this.cmdProcess=exec(cmd,{
        cwd: path,
        detached:false
      }, (error, stdout, stderr) => {
        if(error){
          console.error(error.toString());
          atom.notifications.addError(error.toString());
          this.updateButtons(false);
          return;
        }
        console.log("out" + stdout);
      });
        this.updateButtons(true);
    }catch(ex){
      console.error(ex);
      this.updateButtons(false);
    }
  }
  handleStopDevScript(){
    console.log("handleStopDevScript");
    /*if(this.cmdProcess && this.cmdProcess['kill']!=undefined){
      this.cmdProcess.kill();
      this.cmdProcess=undefined;
    }else{
      console.error("cmdProcess is undefined or hasn't exit process");
    }*/
    if(this.childRef){
      kill(this.childRef.pid)
    }else{
      console.error("childRef is undefined or hasn't exit process");
    }
  }
  getScriptName(){
    let scriptName=document.getElementById('script-name').value;
    return scriptName;
  }
  handleRunWithSpawn(){
    console.log("handleRunWithSpawn");
    var path=atom.project.getPaths()[0];
    var cmd="npm";
    var scriptName=this.getScriptName();
    var spawn=require('child_process').spawn;
    var options={
      cwd: path
    };
    this.childRef=spawn(cmd,["run",scriptName],options);
    this.childRef.stdout.on('data', (data) => {
      this.updateButtons(true);
      if(this.logger){
        this.logger.debug("[scriptTools] " + data.toString())
      }
      console.log(`stdout: ${data}`);
    });

    this.childRef.stderr.on('data', (data) => {
      if(this.logger){
        this.logger.error("[scriptTools] " + data.toString())
      }
      console.log(`stderr: ${data}`);
    });

    this.childRef.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if(this.logger){
        this.logger.info(`child process exited with code ${code}`)
      }
      this.updateButtons(false);
      this.childRef=undefined;
    });
    console.log("spawn created");
  }

  updateButtons(isRunning){
    if (document.getElementById('script-btn-run')){
      document.getElementById('script-btn-run').disabled = isRunning;
      document.getElementById('script-btn-stop').disabled = !isRunning;
      if (isRunning){
        document.getElementById('script-status-indicator').style.background = 'green';
      } else {
        document.getElementById('script-status-indicator').style.background = '#565656';
      }
    }
  }

  appendOn(divContainer){
    $(divContainer).append(scriptPanelDef.render())
    this.bindJS();
    this.updateButtons(this.childRef!=undefined && !this.childRef.killed);
  }

}
