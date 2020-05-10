var vega = require('vega')
var fs = require('fs')
const fetch = require('node-fetch');
const Discord = require('discord.js');
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = {
    getGraph: (msg, country) => {
    fetch("https://corona.lmao.ninja/v2/all")
        .then(data => data.json())
        .then(total => {
            fetch("https://corona.lmao.ninja/v2/historical/" + country)
                .then(data => data.json())
                .then(a => {
                    if (a.timeline != undefined) a = a.timeline;
                    console.log(a);
                    var data = [];
                    for (let i in a.cases) {
                        let date = i.substring(0, i.length - 3);
                        data.push({ x: date, y: a.cases[i], c: "Cases" }, { x: date, y: a.recovered[i], c: "Recovered" }, { x: date, y: a.deaths[i], c: "Deaths" });
                    }
                    var lineGraph = {
                        "$schema": "https://vega.github.io/schema/vega/v5.json",
                        "width": 700,
                        "height": 300,
                        "padding": 5,
                        "signals": [
                            {
                                "name": "interpolate",
                                "value": "monotone"
                            }
                        ],
                        "data": [
                            {
                                "name": "table",
                                "values": data
                            }
                        ],
                        "legends": [
                            {
                                "fill": "color",
                                "title": "Covid-19 Worldwide",
                                "orient": "top-left",
                                "encode": {
                                    "symbols": { "enter": { "fillOpacity": { "value": 0.5 } } },
                                    "labels": { "update": { "text": { "field": "value" } } }
                                }
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
                                "type": "log",
                                "range": "height",
                                "nice": true,
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
                    const config = {
                        "background": "#333",
                        "title": { "color": "#fff" },
                        "style": { "guide-label": { "fill": "#fff" }, "guide-title": { "fill": "#fff" } },
                        "axis": { "domainColor": "#fff", "gridColor": "#888", "tickColor": "#fff" }
                    };
                    var view = new vega
                        .View(vega.parse(lineGraph, config))
                        .renderer('none')
                        .initialize();
                    view
                        .toCanvas()
                        .then(function (canvas) {
                            console.log('Writing PNG to file...')
                            fs.writeFile('lineGraph.png', canvas.toBuffer(), () => "YUUHH");
                            const covidEmbed = new Discord.MessageEmbed()
                                .setTitle(":world_map: Covid-19 Daily Updates in the World :world_map:")
                                .attachFiles(['./lineGraph.png'])
                                .setColor(8388624)
                                .setDescription("Covid 19 statistics for the world")
                                .addField("World Infections", "Total Infected: **" + numberWithCommas(total.cases) +
                                    `** (**${numberWithCommas(total.todayCases)}** increase)`)
                                .addField("World Deaths", "Total Deaths: **" + numberWithCommas(total.deaths) + `** (**${numberWithCommas(total.todayDeaths)}** increase)`)
                                .setImage('attachment://lineGraph.png');
                            msg.channel.send(covidEmbed);

                        })
                        .catch(function (err) {
                            console.log("Error writing PNG to file:")
                            console.error(err)
                            return "error";
                        });

                });

        })

    }
}