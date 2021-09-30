import SystemActions from '../actions/SystemActions.js';
import octopusGroups from '../libs/octopus/groups.js';
import octopusMessages from '../libs/octopus/messages.js';
import wsClients from '../libs/wsClients.js';

import ClientRouter from './ClientRouter.js';
import SystemRouter from './SystemRouter.js';
import logger from '../config/logger.js';

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

            octopusMessages.resendWaitingMessages(ClientRouter);
        }
    } else {
        message.from = ws.name;
        let newMessage = octopusMessages.addMessage(message);
        switch (ws.identity) {
            case "client":
                ClientRouter(newMessage);
                break;
            case "system":
                SystemRouter(newMessage);
                break;
        }
    }
}

export default routers