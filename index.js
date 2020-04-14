require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if(msg.content.split(" ")[0].toLowerCase() == ("kimmary")){
    const args = msg.content.split(/ +/);
    const command = args.slice(1).join(" ").toLowerCase();
    console.info(`Called command: ${command}`);
    var c = command.split(" ");
    if (c[0] == "kick") {
      console.log(msg.mentions.users.first().avatarURL);
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
    if (!bot.commands.has(command)) return;
    try {
      bot.commands.get(command).execute(msg, args);
    } catch (error) {
      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }

  }
});