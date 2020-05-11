var vega = require('vega')
var fs = require('fs')
const fetch = require('node-fetch');
const Discord = require('discord.js');
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = {
    getGraph: (msg, country, isWorld) => {
        country = country.substring(0,1).toUpperCase() + country.substring(1);
        var urlHistorical;
        var urlStats;
        var title = "The World";

        if(isWorld){
            urlHistorical = "https://corona.lmao.ninja/v2/historical/all";
            urlStats = "https://corona.lmao.ninja/v2/all";
        }else{
            urlHistorical = "https://corona.lmao.ninja/v2/historical/"+country;
            urlStats = "https://corona.lmao.ninja/v2/countries/"+country;
        }
        fetch(urlStats)
        .then(data => data.json())
        .then(total => {
            fetch(urlHistorical)
                .then(data => data.json())
                .then(a => {
                    if (a.timeline != undefined) { 
                        a = a.timeline; 
                    }
                    var data = [];
                    for (let i in a.cases) {
                        let date = i.substring(0, i.length - 3);
                        data.push({ x: date, y: a.cases[i], c: "Cases" }, { x: date, y: a.recovered[i], c: "Recovered" }, { x: date, y: a.deaths[i], c: "Deaths" });
                    }
                    var lineGraph = {
                        "$schema": "https://vega.github.io/schema/vega/v5.json",
                        "width": 900,
                        "height": 800,
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
                        "title": {
                            "text": "Covid-19 in " + title,
                            "fontSize": 40,
                            "subtitleColor": "#fff"
                        },

                        "legends": [
                            {
                                "fill": "color",
                                "orient": "top-left",
                                "labelFontSize": 25,
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
                            { 
                                "orient": "bottom", 
                                "scale": "x",
                                "labelFontSize": 14,
                                "labelOverlap": true,
                                "labelAngle": 50,
                                "labelPadding": 15,
                                "labelSeparation": 10,
                                "align": "left"
                            },
                            { 
                                "orient": "left", 
                                "scale": "y",
                                "labelFontSize": 15,
                                "labelPadding": 10,
                            }
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
                    var flag = `:flag_${total.countryInfo.iso2.toLowerCase()}:`;

                    if (flag==undefined) flag = ":world_map:";
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
                            .setTitle(`${flag} Covid-19 Daily Updates in ${country} ${flag}`)
                            .attachFiles(['./lineGraph.png'])
                            .setColor(8388624)
                            .setDescription(`Covid 19 statistics for ${country}`)
                            .addField(`${country} Infections`, "Total Infected: **" + numberWithCommas(total.cases) +
                                `** (**${numberWithCommas(total.todayCases)}** increase)`)
                            .addField(`${country} Deaths`, "Total Deaths: **" + numberWithCommas(total.deaths) + `** (**${numberWithCommas(total.todayDeaths)}** increase)`)
                            .setImage('attachment://lineGraph.png')
                            .setTimestamp(new Date(total.updated))
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