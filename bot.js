// Get the libs
var config = require("./config");
var irc = require("irc");
var glitch = require('./lib/Glitch/glitch'); // the IDE changed this for me when I moved the files :)
var command = require('./lib/Bot/command');
var lastGlitchDate = new glitch.GlitchDate();
var announcementsEnabled = false;

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

// Listen for errors
bot.addListener("error", function(message) {
  console.log(message);
});

// Listen for any message
bot.addListener("message", processMessage);

// Enable time announcements only when we're in the channel
// also give op to LazyCubimal since bot often beats her on after server restart
bot.addListener("join#moonies", function (nick) {
  if ( nick === config.botName ) {
    announcementsEnabled = true;
  }
  if ( nick === 'LazyCubimal' ) {
    console.log('Giving op to LazyCubimal');
    bot.send('MODE', '#moonies', '+o', 'LazyCubimal');
  }
});
bot.addListener("part#moonies", function(nick) {
  if ( nick === config.botName ) {
    announcementsEnabled = false;
  }
});

// Check for a new day and announce it if it is
setTimeout(announceTime, 2000);

// Enabled commands to be typed in on console
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
    var commandText = text.trim();
    processMessage(config.botName, null, commandText, null);
});


//-----------
// Functions
//-----------

function announceTime() {
    var newGlitchDate = new glitch.GlitchDate();
    if (newGlitchDate.dayOfYear !== lastGlitchDate.dayOfYear) {
        if (announcementsEnabled) {
            bot.say(config.channels[0], 'Happy New ' + newGlitchDate.dayOfWeek.name + '!');
            bot.say(config.channels[0], 'The time is ' + newGlitchDate.toString());
            if (newGlitchDate.dayOfWeek.name == 'Moonday') {
                bot.action(config.channels[0], 'moons everyone!');
            }
        }
    }
    lastGlitchDate = newGlitchDate;
    setTimeout(announceTime, 2000);
}

function processMessage(from, to, text, message) {
    var botCommand = command.getCommand(from, text);
    if ( botCommand === null ) {
        return;
    }
    command.processCommand(bot, botCommand, config, shutdown);
}

function shutdown() {
    console.log('Shuting down');
    process.exit();
}
