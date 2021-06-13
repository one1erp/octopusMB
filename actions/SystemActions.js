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
                console.log(e);
            }

            if (jsonMessage) routers(ws, jsonMessage);
        })

        ws.on('close', () => {
            deleteWsClient(ws);
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

exports.addWsToGroup = (ws, group) => {
    let octpousGroup = singleton.octpousGroups[group];
    if (octpousGroup == undefined) {
        singleton.octpousGroups[group] = {
            type: 'rr',
            currentWsIndex: 0,
            wsClients: []
        }
        octpousGroup = singleton.octpousGroups[group];
    } 

    octpousGroup.wsClients.push(ws);
    console.log(singleton.octpousGroups);
}

exports.deleteWsFromGroup = (ws, group) => {

}