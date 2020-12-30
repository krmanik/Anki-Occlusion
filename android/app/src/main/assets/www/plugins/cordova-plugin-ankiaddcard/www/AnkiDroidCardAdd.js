cordova.define("cordova-plugin-ankiaddcard.AnkiDroidCardAdd", function(require, exports, module) {
var exec = require('cordova/exec');

exports.addCard = function (arg0, success, error) {
    exec(success, error, 'AnkiDroidCardAdd', 'addCard', [arg0]);
}

exports.moveImagesToAnkiDroid = function (arg0, success, error) {
    exec(success, error, 'AnkiDroidCardAdd', 'moveImagesToAnkiDroid', [arg0]);
}

});
