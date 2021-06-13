var singleton = rootRequire('./singleton');

exports.sendToGroup = (wsSender, group, message) => {
    let octopusGroup = singleton.octpousGroups[group];
    if (octopusGroup && octopusGroup.wsClients.length > 0) {
        let currentWsIndex = octopusGroup.currentWsIndex;
        currentWsIndex++;
        if (octopusGroup.wsClients.length < currentWsIndex + 1) currentWsIndex = 0;
        octopusGroup.wsClients[currentWsIndex].send(message);
    }
}