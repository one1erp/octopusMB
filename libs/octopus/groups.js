let groups = {};

const addWsToGroup = (ws, group, name) => {
    let octopusGroup = groups[group];
    if (octopusGroup == undefined) {
        groups[group] = {
            type: 'rr',
            currentWsIndex: 0,
            nextWsNameId: 1,
            wsClients: []
        }
    } 

    octopusGroup = groups[group];
    octopusGroup.wsClients.push(ws);
    ws.group = group;

    let newName = name;
    if (!name) {
        newName = group + "_" + octopusGroup.nextWsNameId;
        octopusGroup.nextWsNameId++;
    }
    console.log(groups);
    return newName;
}

const deleteWsFromGroup = (ws) => {
    let group = ws.group;
    let octopusGroup = groups[group];
    if (!octopusGroup) return;

    const index = octopusGroup.wsClients.indexOf(ws);
    if (index > -1) {
        octopusGroup.wsClients.splice(index, 1);
    }

    //delete group if wsClients is empty
    if (octopusGroup.wsClients.length == 0) {
        console.log("deleting empty group: " + group)
        delete groups[group];
    }
}

const isGroupNameExists = (name) => {
    return (groups[name])? true : false;
}

const getGroupByName = (name) => {
    return groups[name];
}

export default {
    addWsToGroup,
    deleteWsFromGroup,
    isGroupNameExists,
    getGroupByName
}

