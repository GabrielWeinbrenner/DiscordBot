require('dotenv').config();
const Discord = require('discord.js');
const Client = require('./client/Client');
const bot = new Client();
var actionlog;
bot.commands = new Discord.Collection();
const botCommands = require('./commands');


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
/* --------- */

bot.on('guildMemberAdd', member => {
  actionlog.send('**' + member.user.username + "** has joined")
  member.addRole()
})
bot.on('guildMemberRemove', member => {
  actionlog.send('**' + member.user.username + '**, has left the server');
});
bot.on('guildBanAdd', member => {
  actionlog.send('**' + member.user.username + '**, has been banned');
});
bot.on('guildBanRemove', member => {
  actionlog.send('**' + member.user.username + '**, has been unbanned');
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
  actionlog.send(`**${message.author}'s** messsage of \`\`\`${message.content}\`\`\` has been deleted`)
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
  actionlog.send(
    `**${channel.name}**
     has been created
  `)
})
bot.on('channelDelete', (channel) => {
  actionlog.send(
    `**${channel.name}**
     has been deleted
  `)
})
/* --------- */
