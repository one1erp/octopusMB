import wsClients from '../libs/wsClients.js';
import octopusGroups from '../libs/octopus/groups.js';
import octopusMessages from '../libs/octopus/messages.js';


const sendToGroup = (group, message) => {
    let octopusGroup = octopusGroups.getGroupByName(group);
    if (octopusGroup && octopusGroup.wsClients.length > 0) {
        if (message.type == "publish") {
            for (let i=0; i<octopusGroup.wsClients.length; i++) {
                octopusGroup.wsClients[i].send(createMessageToClient(message)); 
            }
        } else {
            let currentWsIndex = octopusGroup.currentWsIndex;
            currentWsIndex++;
            if (octopusGroup.wsClients.length < currentWsIndex + 1) currentWsIndex = 0;
            octopusGroup.wsClients[currentWsIndex].send(createMessageToClient(message));
            octopusGroup.currentWsIndex = currentWsIndex;
        }
        octopusMessages.updateStatus(message.uuid, octopusMessages.status.SENT);
    }
}

const sendToClient = (clientName, message) => {
    let client = wsClients.getClientByName(clientName);
    if (!client) return;
    client.send(createMessageToClient(message));
    octopusMessages.updateStatus(message.uuid, octopusMessages.status.SENT);
}

const replyToClient = (replyToMessageId, message) => {
    let originalMessage = octopusMessages.getMessage(replyToMessageId);
    if (!originalMessage) return;
    if (message.replyTo) {
        message.replyToClientMessageId = originalMessage.clientMessageId;
    } else if (message.replyErrorTo) {
        message.replyErrorToClientMessageId = originalMessage.clientMessageId;
    }
    message.to = originalMessage.from;
    sendToClient(message.to, message);
    if (!message.data || (message.data && !message.data.streamType)) {
        octopusMessages.updateStatus(originalMessage.uuid, octopusMessages.status.REPLIED);
    } else if (message.data && message.data.streamType && message.data.streamType == "OctopusStream" && message.data.streamStatus == "END") {
        octopusMessages.updateStatus(originalMessage.uuid, octopusMessages.status.REPLIED);
    }
    
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
    
    if (message.replyErrorToClientMessageId) {
        newMessage.replyErrorToClientMessageId = message.replyErrorToClientMessageId;
        newMessage.message = message.message;
    }
    return JSON.stringify(newMessage);
}

export default {
    sendToGroup,
    sendToClient,
    replyToClient
}