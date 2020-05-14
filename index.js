require('dotenv').config();
const Discord = require('discord.js');
const Client = require('./client/Client');
const bot = new Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const server = require('./serverData');
const embed = require('./static/embeds');

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
try{
  bot.on('guildMemberAdd', member => {
    var actionlog = server.getActionLog(member.guild.id);
    let text = '**' + member.user + "** has joined";
    actionlog.send({ embed: embed.sendEmbed(4289797, text, "", member.user.username, member.user.displayAvatarURL() )})
    member.addRole()
  })
  bot.on('guildMemberRemove', member => {
    var actionlog = server.getActionLog(member.guild.id);

    let text = '**' + member.user + '**, has left the server';
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", member.user.username, member.user.displayAvatarURL()) })

  });
  bot.on('guildBanAdd', member => {
    var actionlog = server.getActionLog(member.guild.id);

    let text = '**' + member.user + '**, has been banned';
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", member.user.username, member.user.displayAvatarURL()) })

  });
  bot.on('guildBanRemove', member => {
    var actionlog = server.getActionLog(member.guild.id);

    let text = '**' + member.user + '**, has been unbanned';
    actionlog.send({ embed: embed.sendEmbed(4289797, text, "", member.user.username, member.user.displayAvatarURL()) })

  });
  bot.on('roleCreate', role => {
    var actionlog = server.getActionLog(role.guild.id);

    let text = '**' + role.name + '**, has been created';
    actionlog.send({ embed: embed.sendEmbed(4289797, text, "", role.guild.name, role.guild.iconURL()) })

  });
  bot.on('roleDelete', role => {
    var actionlog = server.getActionLog(role.guild.id);

    let text = '**' + role.name + '**, has been deleted';
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", role.guild.name, role.guild.iconURL()) })

  });
  // bot.on('roleUpdate', (oldRole, newRole) => {
  //   console.log(oldRole);
  //   console.log(newRole);
  //   let text = '**' + oldRole.name + '**, has been updated';
  // });
  bot.on('messageDelete', message => {
    var actionlog = server.getActionLog(message.guild.id);

    let text = `**${message.author}'s messsage has been deleted in ${message.channel}**`;
    actionlog.send({ embed: embed.sendEmbed(8388624, text, message.content, message.author.username, message.author.displayAvatarURL()) })
  })
  // bot.on('messageUpdate', (oldMessage, newMessage) => {
  //   if (oldMessage.content == "``````") {return;}
  //   actionlog.send(`**${oldMessage.author}'s** messsage of \`\`\`${oldMessage.content}\`\`\` has been editted to ${newMessage.content}`)
  // })

  bot.on('guildMemberUpdate', (oldMember, newMember) => {
    var actionlog = server.getActionLog(oldMember.guild.id);

    if (!(oldMember.nickname == newMember.nickname)) {
      let text = `**${oldMember.displayName}'s** nickname has been changed to ${newMember.nickname}`;
      actionlog.send({ embed: embed.sendEmbed(6164643, text, "", oldMember.user.username, oldMember.user.displayAvatarURL()) })
    }
  })

  bot.on('channelCreate', (channel) => {
    var actionlog = server.getActionLog(channel.guild.id);

    if(actionlog != undefined){
      if(channel.type !== "dm"){
        let text = `**${channel} has been created}**`;
        actionlog.send({ embed: embed.sendEmbed(4289797, text, "", channel.guild.name, channel.guild.iconURL()) })
      }
    }
  })
  bot.on('channelDelete', (channel) => {
    var actionlog = server.getActionLog(channel.guild.id);
    console.log(actionlog);
    let text = `**${channel} has been deleted**`;
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", channel.guild.name, channel.guild.iconURL()) })

  })
}catch(e){
  console.log(e);
}
/* --------- */
