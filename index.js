require('dotenv').config();
const Discord = require('discord.js');
const Client = require('./client/Client');
const bot = new Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const server = require('./serverData');
const embed = require('./static/embeds');
const db = require('quick.db');


Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;
bot.login(TOKEN);

bot.once('reconnecting', () => {
  console.log('Reconnecting!');
});

bot.once('disconnect', () => {
  console.log('Disconnect!');
});

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({
    activity:{name:'with kimmary help'}
  });
});

bot.on('message', msg => {
  try{
    if(msg.author.bot === false){
      var levels = server.addXP(msg.member.id, msg.guild.id);
      if (levels !== null) {
        msg.reply("You have leveled up to level " + levels);
      }
    }
  }catch(err){
    console.log(err)
  }

  if(msg.content.split(" ")[0].toLowerCase() == ("kimmary")){
    const args = msg.content.split(/ +/);
    const command = args.slice(1,3).join(" ").toLowerCase();
    console.info(`Called command: ${command}`);
    if (command.split(" ")[0] == "twitch") {
      bot.commands.get("twitch").execute(msg, args);
    }
    if (command.split(" ")[0] == "actionlog") {
      bot.commands.get("actionlog").execute(msg, args);
    }
    if (command.split(" ")[0] == "leaderboard") {
      bot.commands.get("leaderboard").execute(msg, args);
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


/* 
ACTION LOG:
When a member joins / leaves
ban/unban
role created / given / removed / deleted / updated
message that was edited / deleted
bulk message deletion
moderator command used
channel created / deleted
nickname change
*/
// sendEmbed = (color, text, subtext, authorName, authorImage)
// GREEN = 4289797
// RED = 8388624
// PURPLE = 6164643
/* --------- */
function getActionLog(guild){
  var actionlogid = server.getActionLog(guild.id);
  var actionlog = guild.channels.cache.find(channel => channel.id == actionlogid);
  return actionlog;
}
bot.on('guildMemberAdd', member => {
  console.log("Member Joined");
  var actionlog = getActionLog(member.guild);
  if (actionlog) {
    let text = '**' + member.user + "** has joined";
    actionlog.send({ embed: embed.sendEmbed(4289797, text, "", member.user.username, member.user.displayAvatarURL() )})
  }
})
bot.on('guildMemberRemove', member => {
  console.log("Member Left");
  var actionlog = getActionLog(member.guild);
  if (actionlog) {
  let text = '**' + member.user + '**, has left the server';
  actionlog.send({ embed: embed.sendEmbed(8388624, text, "", member.user.username, member.user.displayAvatarURL()) })
  }
});
bot.on('guildBanAdd', member => {
  console.log("Member Banned");

  var actionlog = getActionLog(member.guild);
  if (actionlog) {
  let text = '**' + member.user + '**, has been banned';
  actionlog.send({ embed: embed.sendEmbed(8388624, text, "", member.user.username, member.user.displayAvatarURL()) })
  }
});
bot.on('guildBanRemove', member => {
  console.log("Member Unbanned");

  var actionlog = getActionLog(member.guild);
  if (actionlog) {
  let text = '**' + member.user + '**, has been unbanned';
  actionlog.send({ embed: embed.sendEmbed(4289797, text, "", member.user.username, member.user.displayAvatarURL()) })
  }
});
bot.on('roleCreate', role => {
  console.log("Role Created");

  var actionlog = getActionLog(role.guild);
  if (actionlog) {
  let text = '**' + role.name + '**, has been created';
  actionlog.send({ embed: embed.sendEmbed(4289797, text, "", role.guild.name, role.guild.iconURL()) })
  }
});
bot.on('roleDelete', role => {
  console.log("Role Deleted");

  var actionlog = getActionLog(role.guild);
  if (actionlog) {
  let text = '**' + role.name + '**, has been deleted';
  actionlog.send({ embed: embed.sendEmbed(8388624, text, "", role.guild.name, role.guild.iconURL()) })
  }
});
// bot.on('roleUpdate', (oldRole, newRole) => {
//   console.log(oldRole);
//   console.log(newRole);
//   let text = '**' + oldRole.name + '**, has been updated';
// });
bot.on('messageDelete', message => {
  console.log("Message Deleted");

  var actionlog = getActionLog(message.guild);
  if (actionlog) {
    let text = `**${message.author}'s messsage has been deleted in ${message.channel}**`;
    actionlog.send({ embed: embed.sendEmbed(8388624, text, message.content, message.author.username, message.author.displayAvatarURL()) })
  }
})
// bot.on('messageUpdate', (oldMessage, newMessage) => {
//   console.log(oldMessage);
//   console.log("------------------");
//   console.log(newMessage);
//   var actionlog = getActionLog(oldMessage.guild);
//   if (actionlog) {
//     let text = `**${oldMessage.author}'s messsage has been editted from ${oldMessage.content}**`;
//     actionlog.send({ embed: embed.sendEmbed(8388624, text, newMessage.content, oldMessage.author.username, oldMessage.author.displayAvatarURL()) })
//   }
// })

bot.on('guildMemberUpdate', (oldMember, newMember) => {
  console.log("Nickname added");

  var actionlog = getActionLog(oldMember.guild);
  if (actionlog) {
    if (!(oldMember.nickname == newMember.nickname)) {
      let text = `**${oldMember.displayName}'s** nickname has been changed to ${newMember.nickname}`;
    }
  }
})

bot.on('channelCreate', (channel) => {
  console.log("Channel Created");

  var actionlog = getActionLog(channel.guild);
  if (actionlog) {
    if(channel.type !== "dm"){
      let text = `**${channel} has been created**`;

      actionlog.send({ embed: embed.sendEmbed(4289797, text, "", channel.guild.name, channel.guild.iconURL()) })
    }
  }
})
bot.on('channelDelete', (channel) => {
  console.log("Channel Deleted");

  var actionlog = getActionLog(channel.guild);
  if(actionlog){
    let text = `**${channel} has been deleted**`;
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", channel.guild.name, channel.guild.iconURL()) })
  }
})
/* --------- */
