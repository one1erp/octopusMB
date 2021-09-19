import logger from '../config/logger.js';

let clients = {};
let clientsNames = {};

const addClient = (ws) => {
    logger.debug("adding ws:" + ws.uuid);
    clients[ws.uuid] = ws;
}


const deleteClient = (ws) => {
    logger.debug("removing ws:" + ws.uuid);
    delete clients[ws.uuid];
}

const addClientName = (ws, name) => {
    clientsNames[name] = ws;
}

const deleteClientName = (ws) => {
    if (ws.name) delete clientsNames[ws.name];
}

const isClientNameExists = (name) => {
    return (clientsNames[name])? true : false;
}

const getClientByName = (name) => {
    return clientsNames[name];
}
export default {
    addClient,
    deleteClient,
    addClientName,
    deleteClientName,
    isClientNameExists,
    getClientByName
}