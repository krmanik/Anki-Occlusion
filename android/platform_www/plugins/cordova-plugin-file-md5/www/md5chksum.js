cordova.define("cordova-plugin-file-md5.md5chksum", function(require, exports, module) {
exports.file = function(fileEntry, success, error){
		var path = fileEntry.toURL();
		if (path){
			cordova.exec(success, error, "md5chksum", "file", [path]);
		}else{
			error("md5chksum: no path");
		}
};



});
