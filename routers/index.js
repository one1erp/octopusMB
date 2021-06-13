const SystemActions = rootRequire('./actions/SystemActions');

const ClientRouter = require('./ClientRouter');
const SystemRouter = require('./SystemRouter');

const routers = (ws, message) => {
    if (ws.identity == null) {
        let group = message.group;
        if (group) group.trim();
        if (group && group.length > 0) {
            ws.identity = "client";
            SystemActions.addWsToGroup(ws, group);
        }
    } else {
        switch (ws.identity) {
            case "client":
                ClientRouter(ws, message);
                break;
            case "system":
                SystemRouter(ws, message);
                break;
        }
    }
}

module.exports = routers