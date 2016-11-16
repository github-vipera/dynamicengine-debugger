/**
 * Created by marcobonati on 03/10/2016.
 */


var currentDeviceInfo = {
        "canScanBarcode": true,
        "os": "android",
        "screen": {
            "density": 2,
            "width": 375,
            "height": 667
        },
        "canScanCreditCard": false,
        "osVersion": "10.0",
        "touchIDCapable": false,
        "isRooted": true,
        "UDID": "n.a.",
        "assetBundleVersion": "",
        "embeddedAssetBundleVersion": "1.0.0",
        "appVer": "1.0.7"
    };

currentDeviceInfo = {
    "isRooted": false,
    "canScanCreditCard": false,
    "canScanBarcode": true,
    "os": "android",
    "osVersion": "7.0",
    "screen": {
        "width": 1080,
        "height": 1794,
        "density": 2.625
    },
    "UDID": "a9b432886dac7e26",
    "model.android.build": "Nexus 5X",
    "model.android.manufacturer": "LGE",
    "model.android.apilevel": 24,
    "model.android.device": "bullhead",
    "model.android.os": "3.10.73-g76d746e(3239497)",
    "model.android.serial": "010f15d21fab3570",
    "model.android.brand": "google",
    "model.android.id": "NBD90W",
    "model.android.product": "bullhead",
    "model.android.hardware": "bullhead",
    "model.android.type": "user",
    "model.android.userAgent": "Dynamic Engine Kitchen Sink/1.0.1 (Phone; Android 7.0; Scale/2.625)",
    "assetBundleVersion": "1.0.1",
    "embeddedAssetBundleVersion": "1.0.1",
    "appVer": "1.0.1",
    "model.android.webview.version.name": "51.0.2704.90",
    "model.android.webview.version.code": 275509050,
    "model.android.webview.version.num": [
        "51",
        "0",
        "2704",
        "90"
    ],
    "touchIDCapable": true,
    "isPasswordOrPinSet": true
};

var currentModelString = "APPLE|iPhone|iOS10.0";
currentModelString = "GOOGLE|Nexus 5X|7.0";

// Constructor
function DeviceInfoHelper(modelString, deviceInfo) {
    // always initialize all instance properties
    this.modelString = modelString;
    this.deviceInfo = deviceInfo;
}

DeviceInfoHelper.prototype.getDeviceInfo = function() {
    return this.deviceInfo;
}

DeviceInfoHelper.prototype.setDeviceInfo = function(deviceInfo) {
    this.deviceInfo = deviceInfo;
}

DeviceInfoHelper.prototype.getModelString = function() {
    return this.modelString;
}

DeviceInfoHelper.prototype.setModelString = function(modelString) {
    this.modelString = modelString;
}

var DeviceInfo = new DeviceInfoHelper(currentModelString, currentDeviceInfo);

module.exports = DeviceInfo;
