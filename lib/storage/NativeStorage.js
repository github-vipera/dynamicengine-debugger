'use babel';
var conf = require('./../Config.js');
var logger = require('./../loggers/logger');
const settings = require('electron-settings');
const storage = require('node-persist');
var fs= require('fs');

//const nativeStorageImpl={};

class NativeStorage{

  constructor(completePath){

    console.log(">>>>>>>>>>>>>>>> NativeStorage.constructor >>>>>>>>>>>>");
    //logger.debug(settings.getSettingsFilePath());

    //var completePath=atom.project.getPaths()[0] + "/localDatabase/";
    storage.initSync({
      dir: completePath,
      stringify: JSON.stringify,
      parse: JSON.parse,
      encoding: 'utf8',
      logging: false,  // can also be custom logging function
      continuous: true,
      interval: false, // milliseconds
      ttl: false, // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
    });
  }
  // class methods
  set = function(key, value) {
      //settings.set(key, value);
      storage.setItem(key,value, function(err) {
          if(err){
            console.error(err);
            logger.error(JSON.stringify(err));
          }
      });
      //nativeStorageImpl[key]=value;
  }

  get = function(key, callback){
      /*settings.get(key).then(val => {
          if (val){
              callback(val);
          } else {
              callback(null);
          }
      });*/
      // promise
      storage.getItem(key).then((value) => {
        if(value){
          callback(value)
        }else{
          callback(null)
        }
      },(err) => {
        console.error(err);
        callback(null);
      });


      /*var val=nativeStorageImpl[key];
      if (val){
          callback(val);
      } else {
          callback(null);
      }*/
  }
  remove(key){
    //settings.deleteSync(key);
    storage.removeItem(key).then(() => {

    }, (err) => {
      console.error(err);
    }); // or use the promise
  }
}
/**
* Native storage instance management
*
*/
var nativeStorageInstance;
function getNativeStorageInstance(config){
  if(nativeStorageInstance == undefined){
    console.log("localDatabase dir: " + config.localdatabase);
    nativeStorageInstance=new NativeStorage(config.localdatabase);
  }
  return nativeStorageInstance;
}

//module.exports = new NativeStorage(atom.project.getPaths()[0] + "/localDatabase/");
module.exports = getNativeStorageInstance;
