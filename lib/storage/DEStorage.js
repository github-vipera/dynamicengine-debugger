'use babel';
var logger = require('./../loggers/logger');
let storageData = {};
class DEStorage{
  set = function(key, value) {

      //localStorage.setItem(key, value);
          var itemToSave;

          if (typeof value == 'string')
          {
              itemToSave = value;
          }
          else
          {
              itemToSave = JSON.stringify(value);
          }

      logger.debug("Set value for '" + key +"' : " + itemToSave);

      storageData[key]  = itemToSave;

  }

  get = function(key){
      var retValue = null;
      if (storageData[key]){
          retValue = storageData[key];
      } else {
          retValue = null;
      }
      logger.debug("Get value for '" + key +"' : " + retValue);
      return retValue;
  }

  clear = function(){
      storageData = {};
  }

}


// Constructor
function DEStorage() {
}

// class methods


// export the class
module.exports = new DEStorage();
