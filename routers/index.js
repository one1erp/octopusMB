const SystemActions = rootRequire('actions/SystemActions');
const octopusGroups = rootRequire('libs/octopus/groups');
const octopusMessages = rootRequire('libs/octopus/messages');
const wsClients = rootRequire('libs/wsClients');

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
                if (wsClients.isClientNameExists(name)) {
                    SystemActions.sendError(ws, "Client name already exists");
                    return;
                }

                if (octopusGroups.isGroupNameExists(name)) {
                    SystemActions.sendError(ws, "Group with the same name already exists");
                    return;
                }
            }
            ws.name = octopusGroups.addWsToGroup(ws, group, message.name);
            wsClients.addClientName(ws, ws.name);

            SystemActions.sendIdentity(ws);
        }
    } else {
        message.from = ws.name;
        let newMessage = octopusMessages.addMessage(message);
        switch (ws.identity) {
            case "client":
                ClientRouter(ws, newMessage);
                break;
            case "system":
                SystemRouter(ws, newMessage);
                break;
        }
    }
}

module.exports = routers