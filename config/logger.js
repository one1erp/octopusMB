const nodeLogger = require('node-logger');
const config = rootRequire('config');

const logger = nodeLogger({
    logFile: config.log.file,
    days: config.log.days,
    zip: config.log.zip,
    maxSize: config.log.maxSize,
    maxFiles: config.log.maxFiles
});

module.exports = logger;
