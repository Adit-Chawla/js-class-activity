const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log('Bot is online!');
});

// Greeting new members
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'intro');
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}!`);
});

// Providing server information
client.on('messageCreate', message => {
  if (message.content === '!serverinfo') {
    const { guild } = message;
    const serverInfo = `
      Server Name: ${guild.name}
      Total Members: ${guild.memberCount}
      Created On: ${guild.createdAt.toDateString()}
      Desc: Created for testing the JS bot as a part of the group tutorial for Team Discord.
    `;
    message.channel.send(serverInfo);
  }
});

// Providing roles information
client.on('messageCreate', message => {
  if (message.content === '!roles') {
    const roles = message.guild.roles.cache.map(role => role.name).join(', ');
    message.channel.send(`Roles: ${roles}`);
  }
});

// Kick command
client.on('messageCreate', message => {
  if (message.content.startsWith('!kick')) {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.reply('You do not have permissions to use this command');
    }
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.resolve(user);
      if (member) {
        member.kick('Optional reason').then(() => {
          message.reply(`Successfully kicked ${user.tag}`);
        }).catch(err => {
          message.reply('I was unable to kick the member');
          console.error(err);
        });
      } else {
        message.reply('That user isn\'t in this server!');
      }
    } else {
      message.reply('You didn\'t mention the user to kick!');
    }
  }
});

// Ban command
client.on('messageCreate', message => {
  if (message.content.startsWith('!ban')) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply('You do not have permissions to use this command');
    }
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.members.resolve(user);
      if (member) {
        member.ban({ reason: 'They were bad!' }).then(() => {
          message.reply(`Successfully banned ${user.tag}`);
        }).catch(err => {
          message.reply('I was unable to ban the member');
          console.error(err);
        });
      } else {
        message.reply('That user isn\'t in this server!');
      }
    } else {
      message.reply('You didn\'t mention the user to ban!');
    }
  }
});

// Clear messages command
client.on('messageCreate', message => {
  if (message.content.startsWith('!clear')) {
    const args = message.content.split(' ').slice(1);
    const amount = parseInt(args[0]);
    if (isNaN(amount)) {
      return message.reply('The amount parameter isn\'t a number!');
    }
    if (amount > 100) {
      return message.reply('You can\'t delete more than 100 messages at once!');
    }
    if (amount < 1) {
      return message.reply('You have to delete at least 1 message!');
    }

    message.channel.bulkDelete(amount, true).catch(err => {
      message.reply('There was an error trying to delete messages in this channel!');
      console.error(err);
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
