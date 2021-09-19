import ClientActions from '../actions/ClientActions.js';
import octopusGroups from '../libs/octopus/groups.js';
import octopusMessages from '../libs/octopus/messages.js';
import wsClients from '../libs/wsClients.js';
import logger from '../config/logger.js';

const ClientRouter = (message) => {
    let name = message.to;
    let data = message.data;
    let replyTo = message.replyTo;
    if (name || replyTo) {
        if (replyTo && octopusMessages.doesMessageExists(replyTo)) {
            logger.debug("replying to messageId: " + replyTo);
            ClientActions.replyToClient(replyTo, message);
        } else if (wsClients.isClientNameExists(name)) {
            logger.debug("sending to client: " + name);
            ClientActions.sendToClient(name, message);
        } else if (octopusGroups.isGroupNameExists(name)) {
            logger.debug("sending to group: " + name);
            ClientActions.sendToGroup(name, message);
        } else {
            logger.debug("setting message: " + message.uuid + " to status waiting");
            octopusMessages.updateStatus(message.uuid, octopusMessages.status.WAITING);
        }
    }
}

export default ClientRouter