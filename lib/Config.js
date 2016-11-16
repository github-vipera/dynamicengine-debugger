'use babel'
export default class Config {
  static getConfig(){
    let settings={};
    //settings.AssetPath= atom.config.get('dynamicengine-debugger.AssetPath');
    //settings.MockImplementationPath= atom.config.get('dynamicengine-debugger.MockImplementationPath');
    //settings.FirstPage= atom.config.get('dynamicengine-debugger.FirstPage');
    settings.RemoteServerUrl= atom.config.get('dynamicengine-debugger.RemoteServerUrl');
    settings.DebugPort= atom.config.get('dynamicengine-debugger.DebugPort');
    settings.DeviceInfo= atom.config.get('dynamicengine-debugger.DeviceInfo');
    return settings;
  }
  static createNewConfig(assetPath,mockImplementationPath,firtsPage,deviceInfo,debugOnDevice){
    var conf=Config.getConfig();
    conf.AssetPath=assetPath;
    conf.MockImplementationPath=mockImplementationPath;
    conf.FirstPage= firtsPage;
    conf.DebugOnDevice=debugOnDevice|| false;
    conf.DeviceInfo=deviceInfo || 'Android';
    return conf;
  }
}
