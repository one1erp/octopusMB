var singleton = rootRequire('./singleton');
const wsClients = rootRequire('libs/wsClients');
const octopusGroups = rootRequire('libs/octopus/groups');
const octopusMessages = rootRequire('libs/octopus/messages');


exports.sendToGroup = (group, message) => {
    let octopusGroup = octopusGroups.getGroupByName(group);
    if (octopusGroup && octopusGroup.wsClients.length > 0) {
        let currentWsIndex = octopusGroup.currentWsIndex;
        currentWsIndex++;
        if (octopusGroup.wsClients.length < currentWsIndex + 1) currentWsIndex = 0;
        octopusGroup.wsClients[currentWsIndex].send(createMessageToClient(message));
        octopusMessages.updateStatus(message.uuid, "sent");
    }
}

const sendToClient = (clientName, message) => {
    let client = wsClients.getClientByName(clientName);
    if (!client) return;
    client.send(createMessageToClient(message));
    octopusMessages.updateStatus(message.uuid, "sent");
}

exports.sendToClient = sendToClient;

exports.replyToClient = (replyToMessageId, message) => {
    let originalMessage = octopusMessages.getMessage(replyToMessageId);
    if (!originalMessage) return;
    message.replyToClientMessageId = originalMessage.clientMessageId;
    message.to = originalMessage.from;
    sendToClient(message.to, message);

}

const createMessageToClient = (message) => {
    let newMessage = {
        messageId: message.uuid,
        data: message.data,
        type: message.type
    }

    if (message.replyToClientMessageId) {
        newMessage.replyToClientMessageId = message.replyToClientMessageId;
    }

    return JSON.stringify(newMessage);
}