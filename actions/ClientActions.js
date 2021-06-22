var singleton = rootRequire('./singleton');
const wsClients = rootRequire('libs/wsClients');
const octopusGroups = rootRequire('libs/octopus/groups');


exports.sendToGroup = (group, message) => {
    let octopusGroup = octopusGroups.getGroupByName(group);
    if (octopusGroup && octopusGroup.wsClients.length > 0) {
        let currentWsIndex = octopusGroup.currentWsIndex;
        currentWsIndex++;
        if (octopusGroup.wsClients.length < currentWsIndex + 1) currentWsIndex = 0;
        octopusGroup.wsClients[currentWsIndex].send(createMessageToClient(message));
    }
}

exports.sendToClient = (clientName, message) => {
    let client = wsClients.getClientByName(clientName);
    if (!client) return;
    client.send(createMessageToClient(message));
}

const createMessageToClient = (message) => {
    let newMessage = {
        messageId: message.uuid,
        data: message.data
    }

    return JSON.stringify(newMessage);
}