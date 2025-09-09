// This line must be at the very top of your file!
require('dotenv').config();
console.log(process.env.DISCORD_BOT_TOKEN); // Add this line!
// The rest of your code follows

const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

// Get the correct token and application ID from your .env file
const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.YOUR_GUILD_ID;

// Define your commands to register with Discord
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    // Add more of your commands here as needed
];

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// When the client is ready, log to the console and start the hourly timer
client.once('ready', async () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);

    // Register slash commands with Discord
    const rest = new REST({ version: '10' }).setToken(token);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }

    // --- 12-HOUR PING FEATURE ---
    // The channel and role IDs you provided
    const channelId = '1382690787736813599';
    const roleId = '1414122461070360687';

    setInterval(async () => {
        try {
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                // Send a message that pings the specified role
                await channel.send(`<@&${roleId}> I'm still here! This is my 12-hour ping.`);
            } else {
                console.error(`Channel with ID ${channelId} not found.`);
            }
        } catch (error) {
            console.error('An error occurred during the 12-hour ping:', error);
        }
    }, 1000 * 60 * 60 * 12); // 1000 milliseconds * 60 seconds * 60 minutes * 12 hours = 12 hours
    // --- END PING FEATURE ---
});

// Listen for interactions (like slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
    // Add more command handlers here
});

// Log in to Discord with your bot's token
client.login(token);

