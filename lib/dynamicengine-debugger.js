'use babel';

import DEDebugger from './DEDebugger';
import DeviceInfo from './DeviceInfo'
import logger from './loggers/logger'
import ConsoleHandler from './loggers/ConsoleHandler'
import MotifConnector from './connectors/MotifConnector'
import { CompositeDisposable } from 'atom';
import Config from './Config'
import EventBus from './events/DebuggerEventBus'
var exec = require('child_process').exec;

const Pane = require('atom-quick-pane');

export default {
  /**
  * DEFINE DEBUGGER OPTIONS
  */
  config:{
    RemoteServerUrl: {
      title: 'Remote Server Url',
      description: 'Set the url of your motif server',
      type: 'string',
      default: "http://localhost:8080/json"
    },
    DebugPort: {
      title: 'Debugger port',
      description: 'Set the debugger port',
      type: 'integer',
      default: 3000,
      minimum: 1024
    }

  },
  deDebugger:undefined,
  subscriptions: null,
  consoleHandler:undefined,
  settingsPanel:undefined,
  currentConf:undefined,
  currentConfPaths:{},
  evaluateToolPanel: undefined,
  evaluateToolPanelInitialized:false,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    // subscribe all debugger actions
    this.subscribeActions();
    this.consoleHandler=new ConsoleHandler();
    this.consoleHandler.setLogger(logger);
    this.deDebugger=new DEDebugger();
    this.deDebugger.initialize();

  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
  },

  subscribeActions() {
    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dynamicengine-debugger:dumpsettings': () => this.dumpSettings()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dynamicengine-debugger:startdebugger': () =>{
        if (!this.currentConf){
          this.openRunConfiguration();
          atom.notifications.addInfo("No settings are defined for run. Configure the project and then press Run.");
        } else {
          this.startDebugger(this.currentConf);
        }
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dynamicengine-debugger:stopdebugger': () => this.stopDebugger()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dynamicengine-debugger:reloadondevice': () => this.deDebugger.evaluateDebuggerCommand({name:"reloadRemote"})
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dynamicengine-debugger:openRunConfiguration': () => this.openRunConfiguration()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dynamicengine-debugger:showConsole': () => this.consoleHandler.attach()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dynamicengine-debugger:toggleEvaluateTool': () => this.toggleEvaluateTool()
    }));


  },


  dumpSettings(){
    console.log('dumpSettings called');
    let settings=Config.getConfig();
    let jsonString=JSON.stringify(settings);
    console.log("settings: " + jsonString);
    atom.notifications.addInfo("settings dump: " + jsonString);
  },

  checkConfiguration(settings){
    //let settings=Config.getConfig();
    if(!settings.AssetPath){
      return false;
    }
    if(!settings.MockImplementationPath && !settings.RemoteServerUrl){
      return false;
    }
    if(!settings.FirstPage){
      return false;
    }
    if(!settings.DebugPort){
      return false;
    }
    if(!settings.DeviceInfo){
      return false;
    }
    return true;
  },

  startDebugger(currentConf){
      if(this.checkConfiguration(currentConf)){
        atom.notifications.addSuccess("DE Debugger started");
        var devInfo = DeviceInfo.getDeviceInfo();
        devInfo.os = currentConf.DeviceInfo;
        DeviceInfo.setDeviceInfo(devInfo);
        this.deDebugger.startDebugger(currentConf);
      }else{
        atom.notifications.addError("Debugger Configuration Error");
      }
  },

  stopDebugger(){
    this.deDebugger.stopDebugger();
    atom.notifications.addInfo("Debugger stopped");
  },

  openRunConfiguration(){
    var that = this;

    //check if already opened
    if (that.settingsPanel){
      //already opened, do nothing
      return;
    }

    var SettingsView = require("./dynamicengine-debugger-runsettings-view.js");

      settingsPanePromise = Pane({
        element: 'div',
        title: 'DE Run Configuration',
        split: 'right',
        activatePane: true
      }, function (err, div) {
        if (err) throw err
        div.innerHTML = SettingsView.render();
        that.settingsPanel = div;

        that.setupRunSettingsUI(div);

      }, function () {
        // clean up any event listeners or other resources here
        that.settingsPanel = undefined;
      });
      settingsPanePromise.then(function(value){
      });
  },

  setupRunSettingsUI(element){
    var that = this;

    //Subscribe events for change buttons state
    EventBus.subscribe('DEBUGGER_STARTED', function(){
      that.onDebuggerStatusChanged('DEBUGGER_STARTED');
    });
    EventBus.subscribe('DEBUGGER_STOPPED', function(){
      that.onDebuggerStatusChanged('DEBUGGER_STOPPED');
    });

    // Setup drop fields
    document.getElementById('derunsettings-txt-rootFolder').addEventListener("drop", function(event){
       event.preventDefault();
       var filePath = event.dataTransfer.getData("initialpath");
       if (filePath){
         that.currentConfPaths.rootFolder = filePath;
         document.getElementById('derunsettings-txt-rootFolder').value = that.formatPath(filePath);
       }
    });
    atom.tooltips.add(document.getElementById('derunsettings-txt-rootFolder'), {title: 'Drop folder from Project treeview.'});

    document.getElementById('derunsettings-txt-indexFile').addEventListener("drop", function(event){
       event.preventDefault();
       var filePath = event.dataTransfer.getData("initialpath");
       if (filePath){
         that.currentConfPaths.indexFile = filePath;
         document.getElementById('derunsettings-txt-indexFile').value = that.formatPath(filePath);
       }
    });
    atom.tooltips.add(document.getElementById('derunsettings-txt-indexFile'), {title: 'Drop the html file from Project.'});

    document.getElementById('derunsettings-txt-serverMockImpl').addEventListener("drop", function(event){
       event.preventDefault();
       var filePath = event.dataTransfer.getData("initialpath");
       if (filePath){
         that.currentConfPaths.serverMockImpl = filePath;
         document.getElementById('derunsettings-txt-serverMockImpl').value = that.formatPath(filePath);
       }
    });
    atom.tooltips.add(document.getElementById('derunsettings-txt-serverMockImpl'), {title: 'Drop the javascript file from Project.'});

    //Setup the buttons
    this.setupButtons();

    //if the current config exists populate with it elsewhere use default values
    if (that.currentConf){
      that.loadCurrentConf(element, that.currentConf);
    } else {
      that.setupDefaultRunSettingsUI(element);
    }

    //Update buttons state
    var isRunning = this.deDebugger.isRunning();
    that.updateButtons(isRunning);
  },

  setupButtons(){
    var that = this;
    document.getElementById('derunsettings-btn-run').addEventListener("click", function(event){
      var assetsPath = that.parsePath(document.getElementById('derunsettings-txt-rootFolder').value);
      var indexFile = that.parsePathRelative(document.getElementById('derunsettings-txt-indexFile').value, assetsPath);
      var mockImpl = that.parsePath(document.getElementById('derunsettings-txt-serverMockImpl').value);
      var osType = document.getElementById('derunsettings-sel-deviceOs').value;
      var deviceToggle = document.getElementById('derunsettings-tog-physicalDevice').checked;
      that.currentConf = Config.createNewConfig(assetsPath, mockImpl, indexFile, osType, deviceToggle);
      that.currentConf.absolutePaths = that.currentConfPaths;
      that.startDebugger(that.currentConf);
    });
    document.getElementById('derunsettings-btn-stop').addEventListener("click", function(event){
      that.stopDebugger();
    });
    document.getElementById('derunsettings-btn-liveReload').addEventListener("click", function(event){
      that.deDebugger.evaluateDebuggerCommand({name:"reloadRemote"});
    });
    document.getElementById('derunsettings-btn-openLogPane').addEventListener("click", ()=> that.consoleHandler.attach() );
    document.getElementById('derunsettings-btn-openChrome').addEventListener("click", ()=> that.openChromeWindow() );
    document.getElementById('derunsettings-btn-toggleEvaluateTool').addEventListener("click", ()=> that.toggleEvaluateTool() );

    that.updateButtons(false);
  },

  loadCurrentConf(element, configuration){
    this.populateRunSettingsUI(this.formatPath(this.currentConf.absolutePaths.rootFolder),
                               this.formatPath(this.currentConf.absolutePaths.indexFile),
                               this.formatPath(this.currentConf.absolutePaths.serverMockImpl),
                               configuration.DebugOnDevice,
                               configuration.DeviceInfo);
  },

  setupDefaultRunSettingsUI(element){
    var defaultIndex = "index.html";
    var defaultMockImpl = "";
    var defaultRootPath = "${Prj}/";
    this.populateRunSettingsUI(defaultRootPath, defaultIndex, defaultMockImpl, false, "ios");
  },

  populateRunSettingsUI(rootFolder, indexFile, mockImpl, runOnPhysicalDev, emulatedOS){
    document.getElementById('derunsettings-txt-rootFolder').value = rootFolder;
    document.getElementById('derunsettings-txt-indexFile').value = indexFile;
    document.getElementById('derunsettings-txt-serverMockImpl').value = mockImpl;
    document.getElementById('derunsettings-sel-deviceOs').value = emulatedOS;
    document.getElementById('derunsettings-tog-physicalDevice').checked = runOnPhysicalDev;
  },

  formatPath(path){
    var currentPath = this.currentProjectPath();
    if (currentPath){
      return path.replace(currentPath, "${Prj}");
    } else {
      return path;
    }
  },

  parsePath(path){
    var currentProjectPath = this.currentProjectPath();
    if (!currentProjectPath){
      return path;
    } else {
      return path.replace("${Prj}/", currentProjectPath + "/");
    }
  },

  parsePathRelative(path, relativeTo){
    var absolutePath = this.parsePath(path);
    var relativePath = absolutePath.replace(relativeTo, "");
    if (relativePath.startsWith("/")){
      relativePath = relativePath.substring(1, relativePath.length-1);
    }
    return relativePath;
  },

  currentProjectPath(){
    var currentPath = undefined;
    var currentPaths = atom.project.getPaths();
    if (currentPaths && currentPaths.length>0){
      return currentPaths[0];
    } else {
      return null;
    }
  },

  updateButtons(isRunning){
    if (document.getElementById('derunsettings-btn-run')){
      document.getElementById('derunsettings-btn-run').disabled = isRunning;
      document.getElementById('derunsettings-btn-stop').disabled = !isRunning;
      document.getElementById('derunsettings-btn-liveReload').disabled = !isRunning;
      if (isRunning){
        document.getElementById('derunsettings-status-indicator').style.background = 'green';
      } else {
        document.getElementById('derunsettings-status-indicator').style.background = '#565656';
      }
    }
  },

  onDebuggerStatusChanged(status){
    if (status==='DEBUGGER_STARTED'){
      this.updateButtons(true);
    } else if (status==='DEBUGGER_STOPPED'){
      this.updateButtons(false);
    }
  },

  openChromeWindow(){
    var cmd = "/Applications/'Google Chrome.app'/Contents/MacOS/'Google Chrome' --auto-open-devtools-for-tabs ";
    if (this.currentConf){
       cmd = cmd + "'http://localhost:"+ this.currentConf.DebugPort +"'";
    }
    exec(cmd, function(error, stdout, stderr) {
      logger.info(stdout);
    });
  },

  showEvaluateTool(){
    if (!this.evaluateToolPanel){
      var panelView = require("./dynamicengine-debugger-evaluate-panel.js");
      var evaluatePanelContainer = document.createElement('dynamicengine-debugger-evaluate-panel-cont');
      evaluatePanelContainer.innerHTML = panelView.render();
      this.evaluateToolPanel = atom.workspace.addBottomPanel( {
          item: evaluatePanelContainer,
          visible: true
      });

    }
    this.evaluateToolPanel.show();

    if (!this.evaluateToolPanelInitialized){
      document.getElementById('deevaluatepanel-btn-hidepanel').addEventListener("click", ()=> this.toggleEvaluateTool() );
      document.getElementById('deevaluatepanel-btn-run').addEventListener("click", ()=> this.sendEvaluateScript() );
      document.getElementById('deevaluatepanel-btn-clear').addEventListener("click", ()=> this.clearEvaluateToolScript() );
      this.evaluateToolPanelInitialized = true;
    }

  },

  hideEvaluateTool(){
    if (this.evaluateToolPanel){
      this.evaluateToolPanel.hide();
    }
  },

  toggleEvaluateTool(){
    if (this.evaluateToolPanel && this.evaluateToolPanel.isVisible()){
      this.hideEvaluateTool();
    } else {
      this.showEvaluateTool();
    }
  },

  clearEvaluateToolScript(){
    if (this.evaluateToolPanelInitialized){
      document.getElementById('deevaluatepanel-txt-script').value = "";
    }
  },

  sendEvaluateScript(){
    if (this.evaluateToolPanelInitialized && this.deDebugger.isRunning()){
      var scriptSrc = document.getElementById('deevaluatepanel-txt-script').value;
      this.deDebugger.evaluateDebuggerCommand({name:"eval", rest:scriptSrc});
    } else {
      atom.notifications.addInfo("Unable to send script to evaluate: the debugger is not yet started.");
    }
  }


};