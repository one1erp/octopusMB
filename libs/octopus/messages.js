const {v4 : uuidv4} = require('uuid');

let messages = {}

let status = {
    RECEIVED: 'received',
    SENT: 'sent',
    REPLIED: 'replied',
    WAITING: 'waiting'
}

const addMessage = (message) => {
    let newMessage = {...message};
    newMessage.uuid = uuidv4();
    newMessage.status = status.RECEIVED;
    messages[newMessage.uuid] = newMessage
    console.log("added message:", newMessage);
    return newMessage;
}

const updateStatus = (messageId, status) => {
    console.log("updating message status:", messageId);
    let message = messages[messageId];
    if (message) {
        message.status = status;
    }
}

const doesMessageExists = (messageId) => {
    console.log("checking if message exists: " + messageId);
    return (messages[messageId])? true : false;
}

const getMessage = (messageId) => {
    return messages[messageId];
}

const clearSentMessages = () => {
    for (const messageId in messages) {
        let message = messages[messageId];
        if (message) {
            if ((message.type != "request" && message.status == status.SENT) || (message.type == "request" && message.status == status.REPLIED)) {
                console.log("deleting sent message:" + messageId);
                delete messages[messageId];
            }

        }
    }
}

const resendWaitingMessages = (router) => {
    console.log("resending waiting messages");
    for (const messageId in messages) {
        let message = messages[messageId];
        if (message && message.status == status.WAITING) {
            console.log("resending message: " + message.uuid);
            router(message);
        }
    }
}

module.exports = {
    addMessage,
    updateStatus,
    doesMessageExists,
    getMessage,
    clearSentMessages,
    status,
    resendWaitingMessages
}