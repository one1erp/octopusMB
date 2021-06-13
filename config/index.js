require('dotenv').config();
rootRequire('libs/env');
var errors = require('./errors');


module.exports = {
	system: {
		port: env(process.env.PORT, "8899")
	},
	errors: errors
}