const SystemActions = rootRequire('./actions/SystemActions');

const ClientRouter = require('./ClientRouter');
const SystemRouter = require('./SystemRouter');

const routers = (ws, message) => {
    if (ws.identity == null) {
        let group = message.group;
        if (group) group = group.trim();
        if (group && group.length > 0) {
            ws.identity = "client";
            if (message.name) {
                let name = message.name.trim();
                if (SystemActions.isWsClientNameExists(name)) {
                    SystemActions.sendError(ws, "Client name already exists");
                    return;
                }
            }
            ws.name = SystemActions.addWsToGroup(ws, group, message.name);
            SystemActions.addWsClientName(ws, ws.name);

            SystemActions.sendIdentity(ws);
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