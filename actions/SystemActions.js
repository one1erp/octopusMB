import http from 'http';
import ws from 'ws';
import config from '../config/index.js';
import singleton from '../singleton/index.js';
import { v4 as uuidv4 }from 'uuid';
import routers from '../routers/index.js';
import octopusGroups from '../libs/octopus/groups.js';
import wsClients from '../libs/wsClients.js';
import octopusMessages from '../libs/octopus/messages.js';
import logger from '../config/logger.js';

const initWS = () => {
    logger.debug("initializing WS server");
    const httpServer = http.createServer({
        //cert: fs.readFileSync('/path/to/cert.pem'),
        //key: fs.readFileSync('/path/to/key.pem')
      });
    const wss = new ws.Server({ server: httpServer });
    singleton.httpServer = httpServer;
    singleton.wsServer = wss;
}

const initWsRouting = () => {
    logger.debug("initializing routing");
    singleton.wsServer.on("connection", (ws) => {
        ws.identity = null;
        ws.uuid = uuidv4();
        wsClients.addClient(ws)
        ws.on("message", function incoming(message) {
            let jsonMessage = null;
            try {
                jsonMessage = JSON.parse(message);
            } catch (e) {
                logger.warning("message is not in a json format");
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

const startWS = () => {
    logger.debug("starting WS server");
    singleton.httpServer.listen(config.system.port, () => {logger.info("listening on port: " + config.system.port)});
}

const sendError = (ws, error) => {
    let errorJson = {
        status: "fail",
        errorMessage: error
    }

    ws.send(JSON.stringify(errorJson));
}

const sendIdentity = (ws) => {
    let jsonMessage = {
        status: "ok",
        identity: ws.name
    }

    ws.send(JSON.stringify(jsonMessage));
}

const initServices = () => {
    logger.debug("initializing util services");
    setInterval(octopusMessages.clearSentMessages, 1000);
}

export default {
    initWS,
    initWsRouting,
    startWS,
    sendError,
    sendIdentity,
    initServices
}