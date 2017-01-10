// export the class
var reload = require('require-reload')(require);
module.exports = function(logger, nativeStorage, deStorage, deUtilities, lodash, implInfo) {
    console.log("MotifConnectorMockWrapper module loading")
    window.Logger = logger;
    window.NativeStorage = nativeStorage;
    window.DEStorage = deStorage;
    window.Utilities = deUtilities;
    window._ = lodash;
    //var moment = require("./moment.js");
    var that=this;
    // Constructor
    function MOTIFConnectorImpl() {

    }
    MOTIFConnectorImpl.executeRequest=function(objectToCall, operation, request, callback){
      var fn = objectToCall[operation];
      var ret = fn(request);
      if (callback){
          callback(ret);
      }
    };
    if(typeof Controller === "undefined"){
        Controller = {}
    }
    if(typeof Controller.mock === "undefined"){
      Controller.mock={
        appStarted:function(){
          Utilities.log("ServerMock started");
        }
      };
    }
    // inject depencendency
    if(implInfo.libraryLoader){
      console.log("Found library loader: " + implInfo.libraryLoader);
      var libraryLoader=reload(implInfo.libraryLoader);
      libraryLoader(reload);
    }else{
      Logger.warn("No library loader defined")
    }
    logger.info("implInfo: " + JSON.stringify(implInfo));
    // populate controller.mock object with all services
    var impl = reload(implInfo.implPath);
    var appName = Controller.mock.appName();
    var appDomain = Controller.mock.appDomain();
    //init mockImplementation
    MOTIFConnectorImpl[appDomain] = {};
    MOTIFConnectorImpl[appDomain][appName] = Controller.mock;
    //fire app started
    MOTIFConnectorImpl.appStarted = function() {
      MOTIFConnectorImpl[appDomain][appName].appStarted();
    }

    return MOTIFConnectorImpl;
}
