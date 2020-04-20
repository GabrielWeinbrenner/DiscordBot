module.exports = {
    name: 'help',
    description: 'Recieve help from Kimmary',
    execute(msg) {
        const help = {
            embed: {
                title: "Kimmary's Commands",
                description: "Here marks the list of commands Kimmary can execute",
                url: "https://discordapp.com",
                color: 4141561,
                timestamp: "2020-04-20T00:02:35.825Z",
                footer: {
                    icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
                    text: "footer text"
                },
                thumbnail: {
                    url: "https://cdn.discordapp.com/embed/avatars/0.png"
                },
                image: {
                    url: "https://cdn.discordapp.com/embed/avatars/0.png"
                },
                author: {
                    name: "Kimmary",
                    icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
                },
                fields: [
                    {
                        name: ":newspaper:",
                        value: "**kimmary get daily** - gets daily covid data",
                        inline: true
                    },
                    {
                        name: "🤔",
                        value: "**kimmmary get me inspired** - gets you inspirational quotes",
                        inline: true
                    },
                    {
                        name: "**Actionlog**",
                        value: "Create an actionlog channel and Kimmary will log actions of users"
                    },
                    {
                        name: "<:thonkang:219069250692841473>",
                        value: "these last two",
                        inline: true
                    },
                    {
                        name: "<:thonkang:219069250692841473>",
                        value: "are inline fields",
                        inline: true
                    }
                ]
            }
        }
        msg.author.send({embed: help.embed});
        msg.delete()
            .then(msg => console.log(`Deleted message from ${msg.author.username}`))
            .catch(console.error);
    },
};