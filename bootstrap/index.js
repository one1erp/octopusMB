const SystemActions = rootRequire('./actions/SystemActions');

const bootstrap = () => {
    SystemActions.initLogger();
    SystemActions.initWS();
    SystemActions.initWsRouting();
    SystemActions.startWS();
    SystemActions.initServices();
}

module.exports = bootstrap