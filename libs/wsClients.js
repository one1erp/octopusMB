let clients = {};
let clientsNames = {};

const addClient = (ws) => {
    console.log("adding ws:" + ws.uuid);
    clients[ws.uuid] = ws;
}


const deleteClient = (ws) => {
    console.log("removing ws:" + ws.uuid);
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

module.exports = {
    addClient,
    deleteClient,
    addClientName,
    deleteClientName,
    isClientNameExists,
    getClientByName
}