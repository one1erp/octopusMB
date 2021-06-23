const {v4 : uuidv4} = require('uuid');

let messages = {}

const addMessage = (message) => {
    let newMessage = {...message};
    newMessage.uuid = uuidv4();
    newMessage.status = "received";
    messages[newMessage.uuid] = newMessage
    console.log("added message:", newMessage);
    return newMessage;
}

const updateStatus = (messageId, status) => {
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

module.exports = {
    addMessage,
    updateStatus,
    doesMessageExists,
    getMessage
}