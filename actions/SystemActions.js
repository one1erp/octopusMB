const http = require('http');
const ws = require('ws');
const config = rootRequire('./config');
var singleton = rootRequire('./singleton');
const { v4: uuidv4 } = require('uuid');
const routers = rootRequire('./routers');
const octopusGroups = rootRequire('./libs/octopus/groups');
const wsClients = rootRequire('./libs/wsClients');
const octopusMessages = rootRequire('libs/octopus/messages');

exports.initLogger = () => {

}

exports.initWS = () => {
    const httpServer = http.createServer({
        //cert: fs.readFileSync('/path/to/cert.pem'),
        //key: fs.readFileSync('/path/to/key.pem')
      });
    const wss = new ws.Server({ server: httpServer });
    singleton.httpServer = httpServer;
    singleton.wsServer = wss;
}

exports.initWsRouting = () => {
    singleton.wsServer.on("connection", (ws) => {
        ws.identity = null;
        ws.uuid = uuidv4();
        wsClients.addClient(ws)
        ws.on("message", function incoming(message) {
            let jsonMessage = null;
            try {
                jsonMessage = JSON.parse(message);
            } catch (e) {
                sendError(ws, "Can't read json message");
            }

            if (jsonMessage) routers(ws, jsonMessage);
        })

        ws.on('close', () => {
            wsClients.deleteClient(ws);
            wsClients.deleteClientName(ws);
            if (ws.group) octopusGroups.deleteWsFromGroup(ws);
        });
    })
}

exports.startWS = () => {
    singleton.httpServer.listen(config.system.port, () => {console.log("listening to: " + config.system.port)});
}

const sendError = (ws, error) => {
    let errorJson = {
        status: "fail",
        errorMessage: error
    }

    ws.send(JSON.stringify(errorJson));
}

exports.sendError = sendError;

const sendIdentity = (ws) => {
    let jsonMessage = {
        status: "ok",
        identity: ws.name
    }

    ws.send(JSON.stringify(jsonMessage));
}

exports.sendIdentity = sendIdentity

exports.initServices = () => {
    setInterval(octopusMessages.clearSentMessages, 1000);
}