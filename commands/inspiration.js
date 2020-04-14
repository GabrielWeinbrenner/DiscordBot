function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    name: "get me inspired",
    description: "Get some inspiration",
    execute(msg, args){
        fetch("https://type.fit/api/quotes")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            msg.channel.send(data[getRandomInt(data.length)]);
        });
    },
}