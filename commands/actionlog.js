const Discord = require('discord.js');
const serverData = require("../serverData");
module.exports = {
    name: 'actionlog',
    description: 'Ping!',
    execute(msg, args) {
        var guildName = msg.guild;
        var guildId = guildName.id;

        if(args[args.length - 2] == "create"){
            var channelName = args[args.length - 1];
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
                .then(channel => serverData.setActionLog(guildId, channel.id));

        }else if(args[args.length -2] == "get"){
            msg.channel.send(serverData.getActionLog(guildId));
        }
    },
};