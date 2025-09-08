// This line must be at the very top of your file to load the .env file.
require('dotenv').config();

// Require the necessary Discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');

// Access environment variables
const token = process.env.DISCORD_BOT_TOKEN;
const roleId = process.env.PING_ROLE_ID;
const guildId = process.env.YOUR_GUILD_ID;
const channelId = process.env.PING_CHANNEL_ID; // The new channel ID variable

// Create a new Discord client instance with the required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ]
});

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log(`Successfully logged in as ${client.user.tag}!`);

    // --- SCHEDULED PING LOGIC ---
    // The setInterval function will run the code inside it every 12 hours.
    // 12 hours * 60 minutes * 60 seconds * 1000 milliseconds
    const twelveHoursInMs = 12 * 60 * 60 * 1000;

    setInterval(() => {
        // Find the guild (server) the bot is in
        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.error('ERROR: Guild not found. Check if the bot is in the correct server or if the guild ID is correct.');
            return;
        }

        // Find the specific channel by its ID
        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            console.error('ERROR: Channel not found. Please check your PING_CHANNEL_ID.');
            return;
        }

        // Find the specific role by its ID
        const role = guild.roles.cache.get(roleId);
        if (!role) {
            console.error('ERROR: Role not found. Please check your PING_ROLE_ID.');
            return;
        }

        // Send the message, tagging the role
        channel.send(`Hello, <@&${roleId}>! It has been 12 hours since my last scheduled message, now let us revive! (This message was sent by hydro).`);
        console.log(`Successfully pinged role ${role.name} in channel ${channel.name}.`);

    }, twelveHoursInMs);
});

// Event listener for messages (the manual ping command)
client.on('messageCreate', message => {
    // Ignore messages from other bots
    if (message.author.bot) return;

    // A simple response to "ping"
    if (message.content.toLowerCase() === 'ping') {
        message.reply('Pong!');
    }
});

// Log in to Discord
if (token) {
    client.login(token);
} else {
    console.error("ERROR: Discord bot token not found in .env file.");
}

