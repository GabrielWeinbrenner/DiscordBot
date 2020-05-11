const fetch = require('node-fetch');
const Discord = require('discord.js');
const getWorldData = require("../covidRequests/getWorldData");
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
        .then( d => d.json() )
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
            msg.channel.send({ embed:covidNJEmbed });
            getWorldData.getGraph(msg, "all", true);
        })
        .catch(d => {
            getWorldData.getGraph(msg, state, false);
        })
    },
};