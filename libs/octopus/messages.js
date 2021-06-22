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

module.exports = {
    addMessage
}