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
});