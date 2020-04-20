const fs = require('fs');
module.exports = {
    addXP: (memberId, guildId) => {
        var data = fs.readFileSync(__dirname + '/xp.json', 'utf8')
        var levels = JSON.parse(data);
        if(levels.guilds[guildId] == undefined){
            levels.guilds[guildId] = {};
        }
        if(levels.guilds[guildId][memberId] == undefined){
            levels.guilds[guildId][memberId] = {xp:0};
        }
        levels.guilds[guildId][memberId].xp = levels.guilds[guildId][memberId].xp+1;
        var data = JSON.stringify(levels);
        fs.writeFileSync(__dirname + '/xp.json', data, 'utf8', (err) => console.log("good"));
        if(levels.guilds[guildId][memberId].xp == 10){
            return "Level UP";
        }
        return null;
    }
}