const Discord = require('discord.js');

module.exports = {
    name: 'create actionlog',
    description: 'Ping!',
    execute(msg, args) {
        var channelName = args[args.length-1];
        console.log(channelName);
    },
};