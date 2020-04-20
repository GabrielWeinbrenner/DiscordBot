require('dotenv').config();
const Discord = require('discord.js');
const Client = require('./client/Client');
const bot = new Client();
var actionlog;
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const xp = require('./levels');
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
  actionlog = bot.channels.cache.find(
    ch => ch.name == 'actionlogg'
  );
});

bot.on('message', msg => {
  try{
    if(msg.author.bot === false){
      var levels = xp.addXP(msg.member.id, msg.guild.id);
      if (levels !== null) {
        msg.reply("You have leveled up to level " + levels);
      }
    }
  }catch(err){
    console.log(err)
  }

  if(msg.content.split(" ")[0].toLowerCase() == ("kimmary")){
    const args = msg.content.split(/ +/);
    const command = args.slice(1).join(" ").toLowerCase();
    console.info(`Called command: ${command}`);

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
    let text = '**' + member.user.username + "** has joined";
    actionlog.send({ embed: embed.sendEmbed(4289797, text, "", member.user.username, member.user.displayAvatarURL() )})
    member.addRole()
  })
  bot.on('guildMemberRemove', member => {
    let text = '**' + member.user.username + '**, has left the server';
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", member.user.username, member.user.displayAvatarURL()) })

  });
  bot.on('guildBanAdd', member => {
    let text = '**' + member.user.username + '**, has been banned';
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", member.user.username, member.user.displayAvatarURL()) })

  });
  bot.on('guildBanRemove', member => {
    let text = '**' + member.user.username + '**, has been unbanned';
    actionlog.send({ embed: embed.sendEmbed(4289797, text, "", member.user.username, member.user.displayAvatarURL()) })

  });
  bot.on('roleCreate', role => {
    let text = '**' + role.name + '**, has been created';
    actionlog.send({ embed: embed.sendEmbed(4289797, text, "", role.guild.name, role.guild.iconURL()) })

  });
  bot.on('roleDelete', role => {
    let text = '**' + role.name + '**, has been deleted';
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", role.guild.name, role.guild.iconURL()) })

  });
  // bot.on('roleUpdate', (oldRole, newRole) => {
  //   console.log(oldRole);
  //   console.log(newRole);
  //   let text = '**' + oldRole.name + '**, has been updated';
  // });
  bot.on('messageDelete', message => {
    let text = `@${message.member.user.tag}'s messsage has been deleted in #${message.channel.name}`;
    actionlog.send({ embed: embed.sendEmbed(8388624, text, message.content, message.member.user.tag, message.author.displayAvatarURL()) })
  })
  // bot.on('messageUpdate', (oldMessage, newMessage) => {
  //   if (oldMessage.content == "``````") {return;}
  //   actionlog.send(`**${oldMessage.author}'s** messsage of \`\`\`${oldMessage.content}\`\`\` has been editted to ${newMessage.content}`)
  // })

  bot.on('guildMemberUpdate', (oldMember, newMember) => {
    if (!(oldMember.nickname == newMember.nickname)) {
      let text = `**${oldMember.displayName}'s** nickname has been changed to ${newMember.nickname}`;
      actionlog.send({ embed: embed.sendEmbed(6164643, text, "", oldMember.user.username, oldMember.user.displayAvatarURL()) })
    }
  })

  bot.on('channelCreate', (channel) => {
    let text = `**${channel.name}**has been created`;
    actionlog.send({ embed: embed.sendEmbed(4289797, text, "", channel.guild.name, channel.guild.iconURL()) })

  })
  bot.on('channelDelete', (channel) => {
    let text = `**${channel.name}** has been deleted`;
    actionlog.send({ embed: embed.sendEmbed(8388624, text, "", channel.guild.name, channel.guild.iconURL()) })

  })
}catch(err){
  console.log(err);
  actionlog = bot.channels.cache.find(
    ch => ch.name == 'actionlogg'
  );
}
/* --------- */
