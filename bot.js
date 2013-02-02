// Create the configuration
var config = {
  channels: ["#moonies"],
  server: "irc.lazycubimal.eu",
  botName: "GlitchBot"
};

// Get the lib
var irc = require("irc");
var glitch = require('./lib/glitch');
var lastGlitchDate = new glitch.GlitchDate();
var announcementsEnabled = false;

// Display exceltions but not quit
//process.on('uncaughtException', function (error) {
//	   console.log(error.stack);
//});

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

bot.addListener("error", function(message) {
  console.log(message);
});

// Listen for any message, say to him/her in the room
bot.addListener("message", function(from, to, text, message) {

  var command = getCommand(from, text);

  if ( command === null ) {
    return;
  }

  var channel = config.channels[0];
  var glitchTime;

  switch (command.name)
  {
    case 'DATE':
      glitchTime = new glitch.GlitchDate();
      bot.say(channel, 'The time is ' + glitchTime.toString());
      break;

    case 'DAY':
      glitchTime = new glitch.GlitchDate();
      bot.say(channel, 'It\'s ' + glitchTime.dayOfWeek.name);
      break;

    case 'MOON':
      bot.action(channel, 'moons everyone!');
      break;

    case 'DANCE':
      bot.action(channel, 'dances!');
      break;

    case 'HUG':
      bot.action(channel, 'hugs everyone!');
      break;

    case 'KISS':
      bot.action(channel, 'kisses everyone!');
      break;

    case 'SPLANK':
      bot.action(channel, 'splanks everyone!');
      break;

    case 'POKE':
      bot.action(channel, 'pokes everyone!');
      break;

    case 'HI':
      var sign = glitch.hiSigns.getRandomSign();
      bot.action(channel, 'gives ' + command.from + ' a "HI!" with ' + sign.toLowerCase() + '.');
      break;

    case 'MOONDAY':
      glitchTime = new glitch.GlitchDate();

      if (glitchTime.dayOfWeek.name === 'Moonday')
      {
          bot.say(channel, 'It\'s Moonday today!');
          bot.action(config.channels[0], 'moons everyone!');
      }
      var nextMoonday = glitchTime.timeUntilMoonday();
        bot.say(channel, 'The next Moonday will be in:');
        bot.say(channel, 'Glitch Time: ' + nextMoonday.glitch.toString());
        bot.say(channel, 'Real Time: ' + nextMoonday.real.toString());
      break;

    default:
      console.log('Unknown command: ' + command.name);
  }
});

bot.addListener("join#moonies", function(nick, message) {
  if ( nick === config.botName ) {
    announcementsEnabled = true;
  }
  if ( nick === 'LazyCubimal' ) {
    console.log('Giving op to LazyCubimal');
    bot.send('MODE', '#moonies', '+o', 'LazyCubimal');
  }
});

bot.addListener("part#moonies", function(nick, message) {
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

  pat = /^(\(([^)]+)\) )?!([a-zA-Z]+)( .*)?$/;
  //pat = /^!([a-zA-Z]+)( .*)?$/;

  if (pat.test(text)) {
    var fromPerson = from;
    if (fromPerson === 'HighlyToxicBot') {
      fromPerson = text.replace(pat, '$2');
    }

    return { name : text.replace(pat, '$3').toUpperCase(),
	     parameterText : text.replace(pat, '$4'),
             "from" : fromPerson };
  } else {
    return null;
  }
}

setTimeout(announceTime, 2000);
