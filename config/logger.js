import nodeLogger from 'node-logger';
import config  from './index.js';

const logger = nodeLogger({
    logFile: config.log.file,
    days: config.log.days,
    zip: config.log.zip,
    maxSize: config.log.maxSize,
    maxFiles: config.log.maxFiles
});

export default logger
