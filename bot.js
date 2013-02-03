// Create the configuration
var config = {
  channels: ["#moonies"],
  server: "irc.lazycubimal.eu",
  botName: "GlitchBot"
};

// Get the lib
var irc = require("irc");
var glitch = require('./lib/Glitch/glitch'); // the IDE changed this for me when I moved the files :)
var command = require('./lib/Bot/command');
var lastGlitchDate = new glitch.GlitchDate();
var announcementsEnabled = false;



// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

bot.addListener("error", function(message) {
  console.log(message);
});

// Listen for any message, say to him/her in the room
bot.addListener("message", processMessage);


function processMessage(from, to, text, message) {

  var botCommand = getCommand(from, text);

  if ( botCommand === null ) {
    return;
  }
    command.processCommand(bot, botCommand, config, shutdown);
}

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

function getCommand(from, text) {
  var pat;

  pat = /^(\(([^)]+)\) )?!([a-zA-Z]+) *(.*)?$/;
  //pat = /^!([a-zA-Z]+)( .*)?$/;

    if (!pat.test(text)) {
        //console.log('getCommand: pattern didn\'t match for ' + text);
        return null;
    } else {
        var fromPerson = from;
        if (fromPerson === 'HighlyToxicBot') {
            fromPerson = text.replace(pat, '$2');
        }

        return { name : text.replace(pat, '$3').toUpperCase(),
                 parameterText : text.replace(pat, '$4'),
                 "from" : fromPerson };

        /*
        console.log('getCommand: ' +
            ' name: ' + command.name +
            ' parameterText: ' + command.parameterText +
            ' from: ' + command.from );

         return command;
        */

    }
}

setTimeout(announceTime, 2000);

process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

process.stdin.on('data', function (text) {
    console.log('received data:', util.inspect(text));

    var commandText = text.trim();
    processMessage(config.botName, null, commandText, null);
});

function shutdown() {
    console.log('Shuting down');
    process.exit();
}
