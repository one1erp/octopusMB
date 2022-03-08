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

/**
 * Ping ws clients
 * 
 * @return void
 */
const pingClients = () => {
    logger.debug("pinging ws clients")
    for (const uuid in clients) {
        let client = clients[uuid];
        if (client.isAlive === false) {
            logger.debug("ws client " + uuid + " is not alive, terminating");
            ws.terminate();
        } else {
            logger.debug("pinging: " + uuid);
            client.isAlive = false;
            client.ping();
        }
    }
}
export default {
    addClient,
    deleteClient,
    addClientName,
    deleteClientName,
    isClientNameExists,
    getClientByName,
    pingClients
}