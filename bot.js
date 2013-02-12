// Get the libs
var config = require("./config");
var irc = require("irc");
var glitch = require('./lib/Glitch/glitch');
var command = require('./lib/Bot/command');

var glitchBot = { // namespace for app's globals
    bot : null,
    channels: config.channels.map(function(item) { return { name: item, announcementsEnabled : false } }),
    lastGlitchDate : new glitch.GlitchDate(),
    setChannelAnnouncementStatus : function(channelName, status) {
        var i, length;
        for (i=0, length=glitchBot.channels.length ; i<length ; i++) {
          if (glitchBot.channels[i].name === channelName) {
            glitchBot.channels[i].announcementsEnabled = status;
          }
        }
    },
    getChannelAnnouncementStatus : function(channelName, status) {
        var i, length;
        for (i=0, length=glitchBot.channels.length ; i<length ; i++) {
            if (glitchBot.channels[i].name === channelName) {
                return glitchBot.channels[i].announcementsEnabled;
            }
        }
        return null;
    }
};

//-----------
// Functions
//-----------
function shutdown() {
    console.log('Shutting down');
    process.exit();
}

function announceTime() {
    var newGlitchDate = new glitch.GlitchDate();
    var i;
    var length;
    var channel;

    if (newGlitchDate.dayOfYear !== glitchBot.lastGlitchDate.dayOfYear) {
        for (i=0, length=glitchBot.channels.length ; i<length ; i++) {
            channel = glitchBot.channels[i];
            if (channel.announcementsEnabled) {
                glitchBot.bot.say(channel, 'Happy New ' + newGlitchDate.dayOfWeek.name + '!');
                glitchBot.bot.say(channel, 'The time is ' + newGlitchDate.toString());
                if (newGlitchDate.dayOfWeek.name === 'Moonday') {
                    glitchBot.bot.action(channel, 'moons everyone!');
                }
            }
        }
    }
    glitchBot.lastGlitchDate = newGlitchDate;
    setTimeout(announceTime, 2000);
}

function processMessage(from, to, text, message) {
    var botCommand = command.getCommand(from, text);
    if ( botCommand === null ) {
        return;
    }

    //TODO: change config to glitchBot.channels ?
    command.processCommand(glitchBot.bot, botCommand, config, shutdown);
}



//------
// Main
//------


// Create the bot
glitchBot.bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

// Listen for errors
glitchBot.bot.addListener("error", function(message) {
  console.log(message);
});

// Listen for any message
glitchBot.bot.addListener("message", processMessage);

// Enable time announcements only when we're in the channel
glitchBot.bot.addListener("join", function (channelName, nick) {
  var i, length;
  if ( nick === config.botName ) {
    glitchBot.setChannelAnnouncementStatus(channelName, true);
  }
});
glitchBot.bot.addListener("part", function(channelName, nick) {
  if ( nick === config.botName ) {
    glitchBot.setChannelAnnouncementStatus(channelName, false);
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



