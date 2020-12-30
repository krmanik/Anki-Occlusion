cordova.define("cordova-plugin-ankiaddcard.AnkiDroidCardAdd", function(require, exports, module) {
var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'AnkiDroidCardAdd', 'coolMethod', [arg0]);
};

exports.addCard = function (arg0, success, error) {
    exec(success, error, 'AnkiDroidCardAdd', 'addCard', [arg0]);
}
});
