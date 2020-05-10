const fetch = require('node-fetch');
const Discord = require('discord.js');
var vega = require('vega')
var fs = require('fs')
var lineGraph;
const client = new Discord.Client();
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = {
    name: 'get daily',
    description: 'Ping!',
    execute(msg, args) {
        var data;
        var state = args.join(" ").substring(18);
        if(!state) state = "new jersey";
        fetch("https://corona.lmao.ninja/v2/states")
        .then(
            d => d.json()
        )
        .then(d => {
            var deathsIncrease;
            var casesIncrease;
            d.forEach(element => {
                if ((element.state).toLowerCase() == state) {
                    data = element;
                    data.todayDeaths == 0 ? deathsIncrease = "" : deathsIncrease = `(${numberWithCommas(data.todayDeaths)} increase)`;
                    data.todayCases == 0 ? casesIncrease = "" : casesIncrease = `(${numberWithCommas(data.todayCases)} increase)`;
                    state = state.split(" ").map(item => item.substring(0, 1).toUpperCase() + item.substring(1)).join(" ");
                }
            });
            const covidNJEmbed = { 
                color: 8388624, 
                // thumbnail: {
                //     url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTBvT6_MyDPiXGBI-LTY2nZ5tQhScGUKpcQNp8FAoQgkyprorOe&usqp=CAU",
                // },
                title: `:house: Covid-19 Daily Updates for ${state} :house:`,
                description: `The total cases for ${state} include`,
                fields: [{
                    name: `${state} Cases \n`,
                    value: `Total Cases: **${numberWithCommas(data.cases)}** ${casesIncrease}`,
                    inline: true
                },
                {
                    name: `${state} Total Deaths \n`,
                    value: `Total Deaths: **${numberWithCommas(data.deaths)}** ${deathsIncrease}`,
                    inline: true
                },
                {
                    name: `${state} Total Tests \n` ,
                    value: `Total Test Results: **${numberWithCommas(data.tests)}**`
                }],
                timestamp: new Date(),
            }
            msg.channel.send({ embed:covidNJEmbed })
            fetch("https://corona.lmao.ninja/v2/all")
            .then(data=>data.json())
            .then(total=>{
                fetch("https://corona.lmao.ninja/v2/historical/all")
                    .then(data => {
                        a = data.json();
                        return a;
                    })
                    .then(a => {
                        var data = [];
                        for (let i in a.cases) {
                            data.push({ x: i, y: a.cases[i], c: 0 });
                        }
                        var lineGraph = {
                            "$schema": "https://vega.github.io/schema/vega/v5.json",
                                "description": "A basic line chart example.",
                                    "width": 700,
                                        "height": 200,
                                            "padding": 5,
                                                "signals": [
                                                    {
                                                        "name": "interpolate",
                                                        "value": "linear"
                                                    }
                                                ],

                                                    "data": [
                                                        {
                                                            "name": "table",
                                                            "values": data
                                                        }
                                                    ],

                                                        "scales": [
                                                            {
                                                                "name": "x",
                                                                "type": "point",
                                                                "range": "width",
                                                                "domain": { "data": "table", "field": "x" }
                                                            },
                                                            {
                                                                "name": "y",
                                                                "type": "linear",
                                                                "range": "height",
                                                                "nice": true,
                                                                "zero": true,
                                                                "domain": { "data": "table", "field": "y" }
                                                            },
                                                            {
                                                                "name": "color",
                                                                "type": "ordinal",
                                                                "range": "category",
                                                                "domain": { "data": "table", "field": "c" }
                                                            }
                                                        ],

                                                            "axes": [
                                                                { "orient": "bottom", "scale": "x" },
                                                                { "orient": "left", "scale": "y" }
                                                            ],

                                                                "marks": [
                                                                    {
                                                                        "type": "group",
                                                                        "from": {
                                                                            "facet": {
                                                                                "name": "series",
                                                                                "data": "table",
                                                                                "groupby": "c"
                                                                            }
                                                                        },
                                                                        "marks": [
                                                                            {
                                                                                "type": "line",
                                                                                "from": { "data": "series" },
                                                                                "encode": {
                                                                                    "enter": {
                                                                                        "x": { "scale": "x", "field": "x" },
                                                                                        "y": { "scale": "y", "field": "y" },
                                                                                        "stroke": { "scale": "color", "field": "c" },
                                                                                        "strokeWidth": { "value": 2 }
                                                                                    },
                                                                                    "update": {
                                                                                        "interpolate": { "signal": "interpolate" },
                                                                                        "strokeOpacity": { "value": 1 }
                                                                                    },
                                                                                    "hover": {
                                                                                        "strokeOpacity": { "value": 0.5 }
                                                                                    }
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                        }
                        var view = new vega
                            .View(vega.parse(lineGraph))
                            .renderer('none')
                            .initialize();
                        view
                            .toCanvas()
                            .then(function (canvas) {
                                // process node-canvas instance for example, generate a PNG stream to write var
                                // stream = canvas.createPNGStream();
                                console.log('Writing PNG to file...')
                                fs.writeFile('lineGraph.png', canvas.toBuffer(), () => "YUUHH");
                                const file = new Discord.MessageAttachment('./lineGraph.png');
                                const covidWorldEmbed = {
                                    color: 8388624,
                                    title: ":world_map: Covid-19 Daily Updates in the World :world_map:",
                                    description: "Covid 19 statistics for the world",
                                    thumbnail: {
                                        url: "https://lh3.googleusercontent.com/proxy/A9YxWd6iZv4mqTHvri6tGEGD84oa0ZYzIwoI0zOLk1c2YeNVOsOuCHGTrH8BToCUKBVNyKLV4QwHKLuW9BtPMfpiLY8LVV-avVDPCYqGTmnPq2Z3va3S_c-fFgvzt2-CfPkmCOld6KuIp9bV8t_vXNOipgk"
                                    },
                                    image: {
                                        url: "../linegraph.png"
                                    },
                                    fields: [{
                                        name: "World Infections",
                                        value: "Total Infected: **" + numberWithCommas(total.cases) +
                                            `** (**${numberWithCommas(total.todayCases)}** increase)`,
                                    },
                                    {
                                        name: "World Deaths",
                                        value: "Total Deaths: **" + numberWithCommas(total.deaths) + `** (**${numberWithCommas(total.todayDeaths)}** increase)`
                                    }],
                                    timestamp: new Date(),
                                }
                                msg.channel.send({files: [file], embed: covidWorldEmbed })

                            })
                            .catch(function (err) {
                                console.log("Error writing PNG to file:")
                                console.error(err)
                            });

                    });

            })
        })
    },
};