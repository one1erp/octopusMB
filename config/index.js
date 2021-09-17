require('dotenv').config();
rootRequire('libs/env');
var errors = require('./errors');


module.exports = {
	system: {
		port: env(process.env.PORT, "8899")
	},
	errors: errors,
	messages: {
		dataDir: env(process.env.DATA_DIR, "data\\"),
		messagesPerFile: env(process.env.MESSAGES_PER_FILE, 50000)
	}
}