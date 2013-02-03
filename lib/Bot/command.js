var glitch = require('../Glitch/glitch');

function processCommand(bot, botCommand, config, shutdown) {
    var channel = config.channels[0];
    var glitchTime;
    var validCommand = true;
    var ignoredCommand = false;

    switch (botCommand.name) {
        case 'SAY':
            if (botCommand.from === config.botName) {
                bot.say(channel, botCommand.parameterText);
            } else {
                ignoredCommand = true;
            }
            break;

        case 'EMOTE':
            if (botCommand.from === config.botName) {
                bot.action(channel, botCommand.parameterText);
            } else {
                ignoredCommand = true;
            }
            break;

        case 'QUIT':
            if (botCommand.from === config.botName) {
                bot.say(channel, 'Bye bye, cruel world! [QUIT command received]');
                //bot.part(channel);
                bot.disconnect('QUIT command received', shutdown); // see how the IDE shows me where there's problems :)
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
                bot.action(config.channels[0], 'moons everyone!');
            }
            var nextMoonday = glitchTime.timeUntilMoonday();
            bot.say(channel, 'The next Moonday will be in:');
            bot.say(channel, 'Glitch Time: ' + nextMoonday.glitch.toString());
            bot.say(channel, 'Real Time: ' + nextMoonday.real.toString());
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
        if (fromPerson === 'HighlyToxicBot') {
            fromPerson = text.replace(pat, '$2');
        }

        return { name : text.replace(pat, '$3').toUpperCase(),
                 parameterText : text.replace(pat, '$4'),
                 "from" : fromPerson };
    }
}

exports.processCommand = processCommand;
exports.getCommand = getCommand;