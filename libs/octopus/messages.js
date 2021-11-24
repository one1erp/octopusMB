import {v4 as uuidv4} from 'uuid';
import logger from '../../config/logger.js';

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
    logger.verbose("added message:", newMessage);
    return newMessage;
}

const updateStatus = (messageId, status) => {
    logger.debug("updating message status:" + messageId);
    let message = messages[messageId];
    if (message) {
        message.status = status;
    }
}

const doesMessageExists = (messageId) => {
    logger.debug("checking if message exists: " + messageId);
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
                logger.debug("deleting sent message:" + messageId);
                delete messages[messageId];
            }

        }
    }
}

const resendWaitingMessages = (router) => {
    logger.debug("resending waiting messages");
    for (const messageId in messages) {
        let message = messages[messageId];
        if (message && message.status == status.WAITING) {
            logger.debug("resending message: " + message.uuid);
            router(message);
        }
    }
}

export default {
    addMessage,
    updateStatus,
    doesMessageExists,
    getMessage,
    clearSentMessages,
    status,
    resendWaitingMessages
}