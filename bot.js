// Get the libs
var config = require("./config");
var irc = require("irc");
var glitch = require('./lib/Glitch/glitch');
var command = require('./lib/Bot/command');

function GlitchBot(config) {
    this.channels = config.channels.map(function(item) { return { name: item, announcementsEnabled : false } });
    this.lastGlitchDate = new glitch.GlitchDate();
    this.botName = config.botName;
    this.server = config.server;
    var that = this;

    that.announceTime = function() {
        var newGlitchDate = new glitch.GlitchDate();
        var i;
        var length;
        var channel;

        if (newGlitchDate.dayOfYear !== that.lastGlitchDate.dayOfYear) {
            for (i=0, length=that.channels.length ; i<length ; i++) {
                channel = that.channels[i];
                if (channel.announcementsEnabled) {
                    that.bot.say(channel, 'Happy New ' + newGlitchDate.dayOfWeek.name + '!');
                    that.bot.say(channel, 'The time is ' + newGlitchDate.toString());
                    if (newGlitchDate.dayOfWeek.name === 'Moonday') {
                        that.bot.action(channel, 'moons everyone!');
                    }
                }
            }
        }
        that.lastGlitchDate = newGlitchDate;
        setTimeout(that.announceTime, 2000);
    };

    that.processMessage = function(from, to, text /*, message */) {
        var botCommand = command.getCommand(from, text);
        if ( botCommand === null ) {
            return;
        }

        //TODO: change config to glitchBot.channels ?
        command.processCommand(that.bot, botCommand, config, that.shutdown);
    };

    that.addListeners = function() {
        var that = this;

        // Listen for errors
        that.bot.addListener("error", function(message) {
            console.log(message);
        });

        // Listen for any message
        that.bot.addListener("message", that.processMessage);

        // Enable time announcements only when we're in the channel
        that.bot.addListener("join", function (channelName, nick) {
            if ( nick === that.botName ) {
                that.setChannelAnnouncementStatus(channelName, true);
            }
        });
        that.bot.addListener("part", function(channelName, nick) {
            if ( nick === that.botName ) {
                that.setChannelAnnouncementStatus(channelName, false);
            }
        });

        // Check for a new day and announce it if it is
        setTimeout(that.announceTime, 2000);
    };

    // Create the bot
    this.bot = new irc.Client(this.server, this.botName, {
        channels: config.channels
    });

    this.addListeners();

    // Enabled commands to be typed in on console
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (text) {
        var commandText = text.trim();
        that.processMessage(that.botName, null, commandText, null);
    });
}

GlitchBot.prototype.setChannelAnnouncementStatus = function(channelName, status) {
    var that = this;
    var i, length;
    for (i=0, length=this.channels.length ; i<length ; i++) {
        if (that.channels[i].name === channelName) {
            that.channels[i].announcementsEnabled = status;
        }
    }
};

/*
GlitchBot.prototype.getChannelAnnouncementStatus = function(channelName) {
    var i, length;
    for (i=0, length=glitchBot.channels.length ; i<length ; i++) {
        if (glitchBot.channels[i].name === channelName) {
            return glitchBot.channels[i].announcementsEnabled;
        }
    }
    return null;
};
*/

GlitchBot.prototype.shutdown = function() {
    console.log('Shutting down');
    process.exit();
};




//------
// Main
//------
var glitchBot = new GlitchBot(config);











