const fs = require('fs');
const data = fs.readFileSync(__dirname + '/server.json', 'utf8');
module.exports = {
    addXP: (memberId, guildId) => {
        var serverData = JSON.parse(data);
        if(serverData.guilds[guildId] == undefined){
            serverData.guilds[guildId] = {};
        }

        if(serverData.guilds[guildId][memberId] == undefined){
            serverData.guilds[guildId][memberId] = {xp:0};
        }

        serverData.guilds[guildId][memberId].xp = serverData.guilds[guildId][memberId].xp+1;

        var writtenData = JSON.stringify(serverData);
        fs.writeFileSync(__dirname + '/server.json', writtenData, 'utf8', (err) => console.log("good"));
        if(levels.guilds[guildId][memberId].xp % 100 === 0){
            return levels.guilds[guildId][memberId].xp /100
        }
        return null;
    },
    getTopXP: (currentGuild) => {
        var serverData = JSON.parse(data);
        var topPeople = [];
        for (x in serverData.guilds[currentGuild]){
            topPeople.push([x, serverData.guilds[currentGuild][x].xp]);
        }
        topPeople.sort(function(a,b){
            return b[1] - a[1];
        })
        topPeople.slice(0, 3)
        return topPeople;
    },
    getActionLog: (guildId) => {
        var channelId = serverData.guilds[guildId].actionLogId;
        if (channelId == undefined){
            return null
        }
        return channelId;
    },
    setActionLog: (guildId, actionLogId) => {
        var serverData = JSON.parse(data);
        if (serverData.guilds[guildId] == undefined) {
            serverData.guilds[guildId] = {};
        }
        if (serverData.guilds[guildId].actionLogId == undefined) {
            serverData.guilds[guildId].actionLogId = actionLogId;
        }
        var writtenData = JSON.stringify(serverData);
        fs.writeFileSync(__dirname + '/server.json', writtenData, 'utf8', (err) => console.log("good"));
        return null;
    }

}