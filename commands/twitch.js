var request = require("request");
var rp = require('request-promise');

const CLIENTID = "z3hlph2q2s6spqqg6gjvpqif766eqt"
module.exports = {
    name: "twitch",
    description: "get twitch data",
    execute(msg,args) {
        var s = msg.content.split(" ");
        var userId = "";
        var streamData = {};
        var userFalse = false;
        var options = {
            method: 'GET',
            url: 'https://api.twitch.tv/helix/users',
            qs: { login: s[2] },
            headers:
            {
                'Client-ID': CLIENTID
            }
        };
        rp(options)
        .then((body) => {
            body = JSON.parse(body);
            streamData["profile_image"] = body.data[0].profile_image_url;
            streamData["offline"] = body.data[0].offline_image_url;
            streamData["desc"] = body.data[0].description;
            streamData["user"] = s[2];
            userId = body.data[0].id;
            return userId;
        })
        .then((id) => {
            var options = {
                method: 'GET',
                url: 'https://api.twitch.tv/helix/streams',
                qs: { user_id: id  },
                headers:
                {
                    'Client-ID': CLIENTID
                }
            };
            rp(options)
            .then((body) => {
                body = JSON.parse(body);
                const d = body.data[0];
                streamData["title"] = d.title;
                streamData["viewers"] = d.viewer_count;
                streamData["user"] = d.user_name;
                streamData["thumbnail"] = d.thumbnail_url;
                var gameId = d.game_id;
                return gameId;
            })
            .then((game_id) => {
                var options = {
                    method: 'GET',
                    url: 'https://api.twitch.tv/helix/games',
                    qs: { id: game_id },
                    headers:
                    {
                        'Client-ID': CLIENTID
                    }
                };
                rp(options)
                .then((body)=>{
                    body=JSON.parse(body);
                    streamData["game"] = body.data[0].name;
                    const embed = {
                        "embed": {
                            "title": streamData.title,
                            "url": `http://twitch.tv/${streamData.user.toLowerCase()}`,
                            "color": 9442302,
                            "timestamp": Date.now(),
                            "thumbnail": {
                                "url": streamData.profile_image
                            },
                            "image": {
                                "url": streamData.thumbnail.replace("{width}", "500").replace("{height}", "300")
                            },
                            "author": {
                                "name": streamData.user,
                                "url": `http://twitch.tv/${streamData.user.toLowerCase()}`,
                                "icon_url": streamData.profile_image
                            },
                            "fields": [
                                {
                                    "name": "Game",
                                    "value": streamData.game,
                                    "inline": true
                                },
                                {
                                    "name": "Viewers",
                                    "value": `:raising_hand: ${streamData.viewers}`,
                                    "inline": true
                                }
                            ]
                        }
                    }
                    msg.channel.send({ embed: embed.embed })
                })

            })
            .catch(() => {
                const embed = {
                    "embed": {
                        "title": streamData.desc.slice(0,50),
                        "url": `http://twitch.tv/${streamData.user.toLowerCase()}`,
                        "color": 9442302,
                        "timestamp": Date.now(),
                        "thumbnail": {
                            "url": streamData.profile_image
                        },
                        "image": {
                            "url": streamData.offline
                        },
                        "author": {
                            "name": streamData.user,
                            "url": `http://twitch.tv/${streamData.user.toLowerCase()}`,
                            "icon_url": streamData.profile_image
                        },
                    }
                }
                msg.channel.send({ embed: embed.embed })

            })
        })
        .catch(()=> msg.reply("Enter a valid twitch user"))
    }
}