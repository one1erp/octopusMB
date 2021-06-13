const http = require('http');
const ws = require('ws');
const config = rootRequire('./config');
var singleton = rootRequire('./singleton');
const { v4: uuidv4 } = require('uuid');
const routers = rootRequire('./routers');

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
        addWsClient(ws)
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
            deleteWsClient(ws);
            deleteWsClientName(ws);
            if (ws.group) deleteWsFromGroup(ws);
        });
    })
}

exports.startWS = () => {
    singleton.httpServer.listen(config.system.port, () => {console.log("listening to: " + config.system.port)});
}

const addWsClient = (ws) => {
    console.log("adding ws:" + ws.uuid);
    singleton.wsClients[ws.uuid] = ws;
}

const deleteWsClient = (ws) => {
    console.log("removing ws:" + ws.uuid);
    delete singleton.wsClients[ws.uuid];
}

exports.addWsToGroup = (ws, group, name) => {
    let octpousGroup = singleton.octpousGroups[group];
    if (octpousGroup == undefined) {
        singleton.octpousGroups[group] = {
            type: 'rr',
            currentWsIndex: 0,
            nextWsNameId: 1,
            wsClients: []
        }
    } 

    octpousGroup = singleton.octpousGroups[group];
    octpousGroup.wsClients.push(ws);
    ws.group = group;

    let newName = name;
    if (!name) {
        newName = group + "_" + octpousGroup.nextWsNameId;
        octpousGroup.nextWsNameId++;
    }
    console.log(singleton.octpousGroups);
    return newName;
}

exports.addWsClientName = (ws, name) => {
    singleton.wsClientNames[name] = ws;
}

const deleteWsClientName = (ws) => {
    if (ws.name) delete singleton.wsClientNames[ws.name];
}

exports.deleteWsClientName = deleteWsClientName;

const deleteWsFromGroup = (ws) => {
    let group = ws.group;
    octpousGroup = singleton.octpousGroups[group];
    if (!octpousGroup) return;

    const index = octpousGroup.wsClients.indexOf(ws);
    if (index > -1) {
        octpousGroup.wsClients.splice(index, 1);
    }
}

exports.deleteWsFromGroup = deleteWsFromGroup

const sendError = (ws, error) => {
    let errorJson = {
        status: "fail",
        errorMessage: error
    }

    ws.send(JSON.stringify(errorJson));
}

exports.sendError = sendError;

const isWsClientNameExists = (name) => {
    return (singleton.wsClientNames[name])? true : false;
}

exports.isWsClientNameExists = isWsClientNameExists

const sendIdentity = (ws) => {
    let jsonMessage = {
        status: "ok",
        identity: ws.name
    }

    ws.send(JSON.stringify(jsonMessage));
}

exports.sendIdentity = sendIdentity