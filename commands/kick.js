function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
module.exports = {
    name: "kick",
    description: "Kick user in the voice channel",
    execute(msg){
        if(msg.mentions.users.first() == undefined) { msg.channel.send("Enter an @"); return;}
        var count = 4;
        var interval = setInterval(() => {
          count--;
          msg.channel.send(count);
          if (count <= 1) {
            var yesOrNo = getRandomInt(2);
            if(yesOrNo == 1){
              msg.channel.send(":fire: KIMMARY VOTES YES! :fire:");
              var member = msg.guild.member(msg.mentions.users.first());
              member.setVoiceChannel(null);
              clearInterval(interval);
            }else{
              msg.channel.send(":relieved: Kimmary gives mercy! :relieved:")
              clearInterval(interval);
            } 
      
          };
        }, 1000);
      
    }

}


// var c = command.split(" ");
// if (c[0] == "kick") {
//   console.log(msg.mentions.users.first().avatarURL);
// }
