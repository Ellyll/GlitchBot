var glitch = require('../Glitch/glitch');

function say(channelNames, bot, message) {
    var i;
    var length = channelNames.length;

    for ( i=0 ; i<length ; i++) {
        bot.action(channelNAmes[i], message);
    }
}

function processCommand(bot, botCommand, channel, botName, shutdown) {
    //var channel = config.channels[0];
    var glitchTime;
    var validCommand = true;
    var ignoredCommand = false;

    switch (botCommand.name) {
        case 'SAY':
            if (botCommand.from === botName) {
                bot.say(channel, botCommand.parameterText);
            } else {
                ignoredCommand = true;
            }
            break;

        case 'EMOTE':
            if (botCommand.from === botName) {
                bot.action(channel, botCommand.parameterText);
            } else {
                ignoredCommand = true;
            }
            break;

        case 'QUIT':
            if (botCommand.from === botName) {
                bot.disconnect('QUIT command received', shutdown);
            } else {
                ignoredCommand = true;
            }
            break;

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
            bot.action(channel, 'gives ' + botCommand.from + ' a "HI!" with ' + sign.toLowerCase() + '.');
            break;

        case 'MOONDAY':
            glitchTime = new glitch.GlitchDate();

            if (glitchTime.dayOfWeek.name === 'Moonday') {
                bot.say(channel, 'It\'s Moonday today!');
                bot.action(channel, 'moons everyone!');
            }
            var nextMoonday = glitchTime.timeUntilMoonday();
            bot.say(channel, 'The next Moonday will be in:');
            bot.say(channel, 'Glitch Time: ' + nextMoonday.glitch.toString());
            bot.say(channel, 'Real Time: ' + nextMoonday.real.toString());
            break;

        case 'ROLL':
            bot.say(channel, 'Rolling...');
            var d12 = new glitch.D12();
            var result = d12.roll();
            var rollMessage = botCommand.from + ' rolled a ' + result + '!';
            if ( result === 'Rook') {
                rollMessage += ' RUNNNN!!!!!';
            }
            setTimeout(function() { bot.say(channel, rollMessage );}, 2700);
            break;

        case 'RACE':
            var raced = glitch.cubimals.race();
            bot.say(channel, botCommand.from + ' raced a ' + raced.cubimal + ' and it went ' + raced.distance + 'm!');
            break;

        default:
            validCommand = false;
            console.log('Unknown command: ' + botCommand.name);
    }

    if (ignoredCommand === false || validCommand === true) {
        console.log('Received command: ' + botCommand.name +
            ' from: ' + botCommand.from +
            ' parameterText: ' + botCommand.parameterText);
    }
}

function getCommand(from, text) {
    var pat = /^(\(([^)]+)\) )?!([a-zA-Z]+) *(.*)?$/;

    if (!pat.test(text)) {
        return null;
    } else {
        var fromPerson = from;
        var botFrom = text.replace(pat, '$2');
        if ((typeof botFrom !== 'undefined') && botFrom.length > 0) {
            //TODO: Security - should we have a list of allowed bot names for fromPerson? otherwise this will work if anyone types in (blah) !command
            fromPerson = botFrom;
        }

        return { name : text.replace(pat, '$3').toUpperCase(),
                 parameterText : text.replace(pat, '$4'),
                 "from" : fromPerson };
    }
}

exports.processCommand = processCommand;
exports.getCommand = getCommand;
