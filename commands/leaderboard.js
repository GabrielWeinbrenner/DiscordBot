var xp = require("../serverData")
module.exports = {
    name: 'get leaderboard',
    description: 'Get the leaderboard of the current guild',
    execute(msg, args) {
        var topXp = xp.getTopXP(msg.guild.id);
        console.log(topXp);
        const leaderboard = {
            title: `${msg.guild.name} leaderboard`,
            color: 13547268,
            fields: [
                {
                    name: ":first_place:",
                    value: `<@${topXp[0][0]}> - ${topXp[0][1]}xp`
                },
                {
                    name: ":second_place:",
                    value: `<@${topXp[1][0]}> - ${topXp[1][1]}xp`
                },
                {
                    name: ":third_place:",
                    value: `<@${topXp[2][0]}> - ${topXp[2][1]}xp`
                },
            ],
            timestamp: new Date(),
        }
        msg.channel.send({embed: leaderboard})
    },
};