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
  var levels = xp.addXP(msg.member.id, msg.guild.id);
  if(levels !== null){
    msg.reply("You have leveled up to level "+levels);
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
// GREEN = 417505
// RED = 8388624
// PURPLE = 6164643
/* --------- */

bot.on('guildMemberAdd', member => {
  const text = '**' + member.user.username + "** has joined";
  actionlog.send({ embed: embed.sendEmbed(417505, text, "", member.user.username, member.user.displayAvatarURL )})
  member.addRole()
})
bot.on('guildMemberRemove', member => {
  const text = '**' + member.user.username + '**, has left the server';
  actionlog.send({ embed: embed.sendEmbed(8388624, text, "", member.user.username, member.user.displayAvatarURL) })

});
bot.on('guildBanAdd', member => {
  const text = '**' + member.user.username + '**, has been banned';
  actionlog.send({ embed: embed.sendEmbed(8388624, text, "", member.user.username, member.user.displayAvatarURL) })

});
bot.on('guildBanRemove', member => {
  const text = '**' + member.user.username + '**, has been unbanned';
  actionlog.send({ embed: embed.sendEmbed(417505, text, "", member.user.username, member.user.displayAvatarURL) })

});
bot.on('roleCreate', role => {
  actionlog.send('**' + role.name + '**, has been created');
});
bot.on('roleDelete', role => {
  actionlog.send('**' + role.name + '**, has been deleted');
});
bot.on('roleUpdate', (oldRole, newRole) => {
  console.log(oldRole);
  console.log(newRole);
  actionlog.send('**' + oldRole.name + '**, has been updated');
});
bot.on('messageDelete', message => {
  const text = `**${message.author}'s** messsage has been deleted`;
  actionlog.send({ embed: embed.sendEmbed(8388624, text, message.content, message.author.username, message.author.displayAvatarURL) })

})
bot.on('messageUpdate', (oldMessage, newMessage) => {
  if (oldMesssage.content === "``````") {return;}
  actionlog.send(
    `**${oldMessage.author}'s** messsage of \`\`\`${oldMessage.content}\`\`\` has been editted to ${newMessage.content}
  `)
})
bot.on('guildMemberUpdate', (oldMember, newMember) => {
  if (!(oldMember.nickname == newMember.nickname)) {
    actionlog.send(
      `**${oldMember.displayName}'s** nickname has been changed to ${newMember.nickname}
  `)
  }
})

bot.on('channelCreate', (channel) => {
  const text = `**${channel.name}**has been created`;
  actionlog.send({ embed: embed.sendEmbed(417505, text, "", channel.guild.name, channel.guild.icon) })

})
bot.on('channelDelete', (channel) => {
  const text = `**${channel.name}** has been deleted`;
  const text = `**${channel.name}**has been created`;
  actionlog.send({ embed: embed.sendEmbed(8388624, text, "", channel.guild.name, channel.guild.icon) })

})
/* --------- */
