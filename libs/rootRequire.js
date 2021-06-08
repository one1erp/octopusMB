var appRoot = require('app-root-path');

var rootRequire = function() {
	global.rootRequire = function(name) {
		let packageName = '';
		if ((name == undefined) || (name == null) || (name.length == 0)) return;
		if ((name.charAt(0) == '/') || (name.charAt(0) == '\\')) {
			packageName = name.substr(1);
		} else {
			packageName = name;
		}
	    return require(appRoot + '/' + packageName);
	}
}

module.exports = rootRequire;