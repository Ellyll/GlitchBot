var command = require('../lib/Bot/command');

describe('command', function() {
    describe('getCommand', function() {
        it('Should parse a line and get the command details for a normal user', function() {
            var text = '!somecommand some parameter text';
            var botCommand = command.getCommand('someuser', text);

            expect(botCommand).toBeDefined();
            expect(botCommand.from).toBe('someuser');
            expect(botCommand.name).toBe('SOMECOMMAND');
            expect(botCommand.parameterText).toBe('some parameter text');
        });

        it('Should parse a line and get the command details for a Minecraft user', function() {
            var text = '(someuser) !somecommand some parameter text';
            var botCommand = command.getCommand('SomeMineCraftServer', text);

            expect(botCommand).toBeDefined();
            expect(botCommand.from).toBe('someuser');
            expect(botCommand.name).toBe('SOMECOMMAND');
            expect(botCommand.parameterText).toBe('some parameter text');
        });

        it('Should ignore (return a null) for non-command text', function() {
            var text = 'wibble! sfsdfs !dsafkqfgks><<<<M<>M><M><MSSEaasafsafasrf</M>';
            var botCommand = command.getCommand('someuser', text);

            expect(botCommand).toBeNull();
        });
    });

    describe('processCommand', function() {
        var MockBot = function() {
            this.sayCalled = false;
            this.actionCalled = false;
            this.disconnectCalled = false;

            this.say = function() { this.sayCalled = true; };
            this.action = function() { this.actionCalled = true; };
            this.disconnect = function(message, shutdown) { this.disconnectCalled = true; shutdown(); }
        };

        var bot;
        var botCommand;
        var config;
        var shutdown;
        var shutdownCalled;
        var channel;

        beforeEach(function(){
            bot = new MockBot();
            botCommand = { from: "someone", name: null, parameterText: null };
            config = { channels: [ 'somechannel' ], botName: "someoneelse" };
            shutdownCalled = false;
            shutdown = function () { shutdownCalled = true; };
            channel = 'somechannel';
        });

        it('Should do nothing for an invalid command', function() {
            botCommand.name = 'SOMEINVALIDCOMMAND';

            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.sayCalled).toBe(false);
            expect(bot.actionCalled).toBe(false);
            expect(bot.disconnectCalled).toBe(false);
        });

        it('Should for QUIT command, call disconnect() and shutdown() if from name the same as the bot\'s name', function(){
            botCommand.name = 'QUIT';
            botCommand.from = 'someone';
            config.botName = 'someone';

            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.disconnectCalled).toBe(true);
            expect(shutdownCalled).toBe(true);
        });

        it('Should for QUIT command, ignore it if from name is not the same as the bot\'s name', function(){
            botCommand.name = 'QUIT';
            botCommand.from = 'someone';
            config.botName = 'someoneelse';

            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.disconnectCalled).toBe(false);
            expect(shutdownCalled).toBe(false);
        });

        it('Should for SAY command call say() if from name the same as the bot\'s name', function() {
            botCommand.name = 'SAY';
            botCommand.from = 'someone';
            config.botName = 'someone';

            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.sayCalled).toBe(true);
            expect(bot.disconnectCalled).toBe(false);
            expect(shutdownCalled).toBe(false);
        });

        it('Should for SAY command ignore it if from name is not the same as the bot\'s name', function() {
            botCommand.name = 'SAY';
            botCommand.from = 'someone';
            config.botName = 'someoneelse';

            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.sayCalled).toBe(false);
            expect(bot.disconnectCalled).toBe(false);
            expect(shutdownCalled).toBe(false);
        });

        it('Should for EMOTE command call action() if from name the same as the bot\'s name', function() {
            botCommand.name = 'EMOTE';
            botCommand.from = 'someone';
            config.botName = 'someone';

            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(true);
            expect(bot.disconnectCalled).toBe(false);
            expect(shutdownCalled).toBe(false);
        });

        it('Should for EMOTE command ignore it if from name is not the same as the bot\'s name', function() {
            botCommand.name = 'EMOTE';
            botCommand.from = 'someone';
            config.botName = 'someoneelse';

            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(false);
            expect(bot.disconnectCalled).toBe(false);
            expect(shutdownCalled).toBe(false);
        });

        // say() based commands: 'DATE', 'DAY', 'MOONDAY'
        it('Should call say() for the DATE command', function() {
            botCommand.name = 'DATE';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.sayCalled).toBe(true);
        });
        it('Should call say() for the DAY command', function() {
            botCommand.name = 'DAY';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.sayCalled).toBe(true);
        });
        it('Should call say() for the MOONDAY command', function() {
            botCommand.name = 'MOONDAY';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.sayCalled).toBe(true);
        });

        it('Should call say() for the ROLL command', function() {
            runs(function() {
                botCommand.name = 'ROLL';
                command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            }, 500);

            // roll waits for 2.7 secs
            waitsFor(function() { return bot.sayCalled; }, 10000);
            runs(function() { expect(bot.sayCalled).toBe(true); });
        });

        // action() based commands: 'MOON', 'DANCE', 'HUG', 'KISS', 'SPLANK', 'POKE', 'HI'
        it('Should call action() for the MOON command', function() {
            botCommand.name = 'MOON';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(true);
        });
        it('Should call action() for the DANCE command', function() {
            botCommand.name = 'DANCE';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(true);
        });
        it('Should call action() for the HUG command', function() {
            botCommand.name = 'HUG';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(true);
        });
        it('Should call action() for the KISS command', function() {
            botCommand.name = 'KISS';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(true);
        });
        it('Should call action() for the SPLANK command', function() {
            botCommand.name = 'SPLANK';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(true);
        });
        it('Should call action() for the POKE command', function() {
            botCommand.name = 'POKE';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(true);
        });
        it('Should call action() for the HI command', function() {
            botCommand.name = 'HI';
            command.processCommand(bot, botCommand, channel, config.botName, shutdown);
            expect(bot.actionCalled).toBe(true);
        });

    });
});