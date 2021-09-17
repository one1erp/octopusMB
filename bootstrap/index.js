import SystemActions from '../actions/SystemActions.js';

const bootstrap = () => {
    SystemActions.initWS();
    SystemActions.initWsRouting();
    SystemActions.startWS();
    SystemActions.initServices();
}

export default bootstrap