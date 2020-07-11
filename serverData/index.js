var db = require('quick.db')

module.exports = {
    addXP: (memberId, guildId) => {
        db.add(`guilds.${guildId}.${memberId}.xp`, 1)
        if (db.get(`guilds.${guildId}.${memberId}.xp`) % 100 === 0){
            return db.get(`guilds.${guildId}.${memberId}.xp`) /100
        }
        return null;
    },
    getTopXP: (currentGuild) => {
        var topPeople = [];
        for (x in db.get(`guilds.${currentGuild}`)){
            topPeople.push([x, db.get(`guilds.${currentGuild}.${x}.xp`)]);
        }
        topPeople = topPeople.filter((person) => person[0] != "actionlog");
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
    clearLeaderBoard: (guildId) =>{
        var currentActionLog = db.get(`guilds.${guildId}.actionlog`);
        db.set(`guilds.${guildId}`, "");
        db.set(`guilds.${guildId}.actionlog`, currentActionLog);
        return null;
    },
    getActionLog: (guildId) => {
        try{
            var channelId = db.get("guilds." + guildId + ".actionlog");
            if(channelId == undefined){
                return null;
            }
            return channelId;
        }catch(e){
            return null;

        }

    },
    setActionLog: (guildId, actionLogId) => {
        db.set(`guilds.${guildId}.actionlog`, actionLogId);
        return null;
    }

}