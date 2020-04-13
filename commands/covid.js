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

        fetch("https://covidtracking.com/api/states")
        .then(
            d => d.json()
        )
        .then(d => {
            d.forEach(element => {
                if (element.state == "NJ") {
                    data = element;
                }
            });
            console.log(data);
            const covidNJEmbed = { 
                color: 3447003, 
                thumbnail: "https://cdn.britannica.com/63/5363-050-F797D3B9/Africa.jpg",
                title: ":house: Covid-19 Daily Updates for NJ :house:",
                description: "The total cases for NJ include",
                fields: [{
                    name: "New Jersey Infected \n",
                    value: `Total Infected: **${numberWithCommas(data.positive)}**`,
                },
                {
                    name: "New Jersey Total Tests \n" ,
                    value: `Total Test Results: **${numberWithCommas(data.totalTestResults)}**`
                }],
                timestamp: new Date(),
            }
            msg.channel.send({ embed:covidNJEmbed })
            fetch("https://corona.lmao.ninja/all")
            .then(data=>data.json())
            .then(data=>{
                console.log(data);
                const covidWorldEmbed = {
                    color: 3447003,
                    title: ":world_map: Covid-19 Daily Updates in the World :world_map:",
                    description: "Covid 19 statistics for the world",
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

        // msg.reply('pong');
        // msg.channel.send('pong');
    },
};