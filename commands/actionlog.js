const Discord = require('discord.js');
const serverData = require("../serverData");
module.exports = {
    name: 'create actionlog',
    description: 'Ping!',
    execute(msg, args) {
        var channelName = args[args.length-1];
        var guildName = msg.guild;
        var guildId = guildName.id;
        guildName.channels.create(
            channelName,
            {
                type: 'text',
                // permissionOverwrites: [
                //     {
                //         id: msg.author.id,
                //         deny: ['VIEW_CHANNEL'],
                //     },
                // ],
            }
        )
        .then(channel => serverData.setActionLog(guildId,channel.id));
    },
};