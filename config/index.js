import env from 'dotenv-defaults';
import errors from './errors.js';
import dotenvParseVariables from 'dotenv-parse-variables';

let baseEnv = env.config();
let parsedEnv = dotenvParseVariables(baseEnv.parsed);


export default {
	system: {
		port: parsedEnv.PORT,
		pingInterval: parsedEnv.PING_INTERVAL,
		password: parsedEnv.SYSTEM_PASSWORD
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