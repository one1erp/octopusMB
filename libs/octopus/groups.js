let groups = {};

const addWsToGroup = (ws, group, name) => {
    let octpousGroup = groups[group];
    if (octpousGroup == undefined) {
        groups[group] = {
            type: 'rr',
            currentWsIndex: 0,
            nextWsNameId: 1,
            wsClients: []
        }
    } 

    octpousGroup = groups[group];
    octpousGroup.wsClients.push(ws);
    ws.group = group;

    let newName = name;
    if (!name) {
        newName = group + "_" + octpousGroup.nextWsNameId;
        octpousGroup.nextWsNameId++;
    }
    console.log(groups);
    return newName;
}

const deleteWsFromGroup = (ws) => {
    let group = ws.group;
    octpousGroup = groups[group];
    if (!octpousGroup) return;

    const index = octpousGroup.wsClients.indexOf(ws);
    if (index > -1) {
        octpousGroup.wsClients.splice(index, 1);
    }

    //delete group if wsClients is empty
    if (octpousGroup.wsClients.length == 0) {
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

module.exports = {
    addWsToGroup,
    deleteWsFromGroup,
    isGroupNameExists,
    getGroupByName
}

