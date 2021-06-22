const ClientActions = rootRequire('./actions/ClientActions');
const octopusGroups = rootRequire('libs/octopus/groups');
const octopusMessages = rootRequire('libs/octopus/messages');
const wsClients = rootRequire('libs/wsClients');

const ClientRouter = (ws, message) => {
    let name = message.to;
    let data = message.data;
    if (name) {
        if (wsClients.isClientNameExists(name)) {
            console.log("sending to client: " + name);
            ClientActions.sendToClient(name, message);
        } else if (octopusGroups.isGroupNameExists(name)) {
            console.log("sending to group: " + name);
            ClientActions.sendToGroup(name, message);
        }
    }
}

module.exports = ClientRouter