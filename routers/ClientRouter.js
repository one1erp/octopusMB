const ClientActions = rootRequire('./actions/ClientActions');

const ClientRouter = (ws, message) => {
    if (message.to) {
        ClientActions.sendToGroup(ws, message.to, message.data);
    }
}

module.exports = ClientRouter