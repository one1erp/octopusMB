var rootRequire = require('./libs/rootRequire')();
const logger = require('./config/logger');

var bootstrap = require('./bootstrap');

logger.info("service started");
bootstrap();
