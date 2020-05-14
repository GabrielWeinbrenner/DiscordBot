const fs = require('fs');
module.exports = {
    addXP: (memberId, guildId) => {
        const data = fs.readFileSync(__dirname + '/server.json', 'utf8');

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
        if(serverData.guilds[guildId][memberId].xp % 100 === 0){
            return serverData.guilds[guildId][memberId].xp /100
        }
        return null;
    },
    getTopXP: (currentGuild) => {
        const data = fs.readFileSync(__dirname + '/server.json', 'utf8');

        var serverData = JSON.parse(data);
        var topPeople = [];
        for (x in serverData.guilds[currentGuild]){
            topPeople.push([x, serverData.guilds[currentGuild][x].xp]);
        }
        topPeople.sort(function(a,b){
            return b[1] - a[1];
        })
        topPeople.slice(0, 3)
        if(topPeople.length < 3){
            for(var i = 0; i <= 3 - topPeople.length; i++){
                topPeople.push(["none",0])
            }
        }
        return topPeople;
    },
    getActionLog: (guildId) => {
        const data = fs.readFileSync(__dirname + '/server.json', 'utf8');

        var serverData = JSON.parse(data);
        try{
            var channelId = serverData.guilds[guildId].actionLogId;
            return channelId;
        }catch(e){
            return null;

        }

    },
    setActionLog: (guildId, actionLogId) => {
        const data = fs.readFileSync(__dirname + '/server.json', 'utf8');

        var serverData = JSON.parse(data);
        if (serverData.guilds[guildId] == undefined) {
            serverData.guilds[guildId] = {};
        }
        if (serverData.guilds[guildId].actionLogId == undefined) {
            serverData.guilds[guildId].actionLogId = actionLogId;
        }
        serverData.guilds[guildId].actionLogId = actionLogId;
        var writtenData = JSON.stringify(serverData);
        fs.writeFileSync(__dirname + '/server.json', writtenData, 'utf8', (err) => console.log("good"));
        return null;
    }

}