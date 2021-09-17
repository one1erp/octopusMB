const env = require('dotenv');
rootRequire('libs/env');
var errors = require('./errors');
const dotenvParseVariables = require('dotenv-parse-variables');

let baseEnv = env.config();
let parsedEnv = dotenvParseVariables(baseEnv.parsed);


module.exports = {
	system: {
		port: parsedEnv.PORT,
	},
	errors: errors,
	messages: {
		dataDir: parsedEnv.DATA_DIR,
		messagesPerFile: parsedEnv.MESSAGES_PER_FILE,
	},
	log: {
        file: parsedEnv.LOG_FILE,
        days: parsedEnv.LOG_DAYS,
        maxSize: parsedEnv.LOG_MAX_SIZE,
        zip: parsedEnv.LOG_ZIP,
        maxFiles: parsedEnv.LOG_MAX_FILES,
    }
}