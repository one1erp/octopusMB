import SystemActions from "../actions/SystemActions.js";

const SystemRouter = (message) => {
    let type = message.type;
    switch (type) {
        case "system-query":
            let query = message.query;
            switch (query) {
                case "client.exists":
                    SystemActions.ResponseClientOrGroupExists(message.queryData, message.from, message.clientMessageId, message.uuid);
            }
            break;
    }
}

export default SystemRouter
