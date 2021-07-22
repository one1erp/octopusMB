const ClientActions = rootRequire('./actions/ClientActions');
const octopusGroups = rootRequire('libs/octopus/groups');
const octopusMessages = rootRequire('libs/octopus/messages');
const wsClients = rootRequire('libs/wsClients');

const ClientRouter = (message) => {
    let name = message.to;
    let data = message.data;
    let replyTo = message.replyTo;
    if (name || replyTo) {
        if (replyTo && octopusMessages.doesMessageExists(replyTo)) {
            console.log("replying to messageId: " + replyTo);
            ClientActions.replyToClient(replyTo, message);
        } else if (wsClients.isClientNameExists(name)) {
            console.log("sending to client: " + name);
            ClientActions.sendToClient(name, message);
        } else if (octopusGroups.isGroupNameExists(name)) {
            console.log("sending to group: " + name);
            ClientActions.sendToGroup(name, message);
        } else {
            console.log("setting message: " + message.uuid + " to status waiting");
            octopusMessages.updateStatus(message.uuid, octopusMessages.status.WAITING);
        }
    }
}

module.exports = ClientRouter