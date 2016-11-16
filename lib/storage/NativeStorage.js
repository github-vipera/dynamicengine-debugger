'use babel';
var conf = require('./../Config.js');
var logger = require('./../loggers/logger');
const settings = require('electron-settings');
const nativeStorageImpl={};
class NativeStorage{

  constructor(){
    logger.debug(settings.getSettingsFilePath());
  }
  // class methods
  set = function(key, value) {
      settings.set(key, value);
      //nativeStorageImpl[key]=value;
  }

  get = function(key, callback){
      settings.get(key).then(val => {
          if (val){
              callback(val);
          } else {
              callback(null);
          }
      });
      /*var val=nativeStorageImpl[key];
      if (val){
          callback(val);
      } else {
          callback(null);
      }*/
  }
}

module.exports = new NativeStorage();
