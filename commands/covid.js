const fetch = require('node-fetch');
const Discord = require('discord.js');

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
        if(state == undefined) state = "New Jersey";
        fetch("https://corona.lmao.ninja/v2/states")
        .then(
            d => d.json()
        )
        .then(d => {
            var deathIncrease;
            var casesIncrease;
            d.forEach(element => {
                if ((element.state).toLowerCase() == state) {
                    data = element;

                    data.todayDeaths == 0 ? deathIncrease = "" : deathIncrease = `(${numberWithCommas(data.todayDeaths)} increase)`
                    data.todayCases == 0 ? casesIncrease = "" : casesIncrease = `(${numberWithCommas(data.todayCases)} increase)`
                    state = state.split(" ").map(item => item.substring(0, 1).toUpperCase() + item.substring(1)).join(" ");
                }
            });
            const covidNJEmbed = { 
                color: 8388624, 
                thumbnail: {
                    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTBvT6_MyDPiXGBI-LTY2nZ5tQhScGUKpcQNp8FAoQgkyprorOe&usqp=CAU",
                },
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
            .then(data=>{
                fetch("https://corona.lmao.ninja/v2/historical/all")
                    .then(data => {
                        a = data.json()
                        for (const i in a.cases) {
                            b.push({ x: i, y: a.cases[i] });
                        }
                    })
                    .then(data => {
                        const casesConfig = {
                            type: 'line',
                            data: {
                                datasets: [{
                                    backgroundColor: 'transparent',
                                    borderColor: 'red',
                                    label: 'Deaths',
                                    data: data,
                                    fill: false,
                                    pointRadius: 0,
                                    cubicInterpolationMode: 'monotone',
                                    borderCapStyle: 'round'
                                }]
                            },
                            options: {
                                layout: {
                                    padding: 10,
                                    lineHeight: 1
                                },
                                legend: {
                                    display: false
                                },
                                linearGradientLine: true,
                                scales: {
                                    yAxes: [{
                                        display: false,
                                        ticks: {
                                            display: false
                                        }
                                    }],
                                    xAxes: [{
                                        display: false
                                    }]
                                }
                            }
                        }
                    });

                const covidWorldEmbed = {
                    color: 8388624,
                    title: ":world_map: Covid-19 Daily Updates in the World :world_map:",
                    description: "Covid 19 statistics for the world",
                    thumbnail: {
                        url: "https://lh3.googleusercontent.com/proxy/A9YxWd6iZv4mqTHvri6tGEGD84oa0ZYzIwoI0zOLk1c2YeNVOsOuCHGTrH8BToCUKBVNyKLV4QwHKLuW9BtPMfpiLY8LVV-avVDPCYqGTmnPq2Z3va3S_c-fFgvzt2-CfPkmCOld6KuIp9bV8t_vXNOipgk"
                    },
                    fields: [{
                        name: "World Infections",
                        value: "Total Infected: **" + numberWithCommas(data.cases) + 
                            `** (**${numberWithCommas(data.todayCases)}** increase)`,
                    },
                    {
                        name: "World Deaths",
                        value: "Total Deaths: **" + numberWithCommas(data.deaths) + `** (**${numberWithCommas(data.todayDeaths)}** increase)`
                    }],
                    timestamp: new Date(),
                }
                msg.channel.send({ embed: covidWorldEmbed })
            })
        })
    },
};