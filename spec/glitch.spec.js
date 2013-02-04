var glitch = require('../lib/Glitch/glitch');

describe('Glitch', function() {
    it('Should be defined', function() {
        expect(glitch).not.toBeUndefined();
    });

    describe('giants', function() {
        it('Should contain a list of all the giants', function() {
            expect(glitch.giants).not.toBeUndefined();
            expect(glitch.giants.length).toBe(11);
        });
    });

    describe('months', function() {
        it('Should contain a list of all the Glitch months', function() {
            expect(glitch.months).not.toBeUndefined();
            expect(glitch.months.length).toBe(12);
        });
        it('Should have Primuary as the first month', function () {
            expect(glitch.months[0].name).toBe('Primuary');
        });
        it('Should have Recurse as the last month', function () {
            expect(glitch.months[11].name).toBe('Recurse');
        });
    });

    describe('days', function() {
        it('Should contain a list of all the Glitch days', function() {
            expect(glitch.days).not.toBeUndefined();
            expect(glitch.days.length).toBe(8);
            expect(glitch.days[0]).toBe('Hairday');
            expect(glitch.days[7]).toBe('Fabday');
        });
    });

    describe('hiSigns',function () {
        it('Should contain a list of hi signs', function() {
            expect(glitch.hiSigns).not.toBeUndefined();
            expect(glitch.hiSigns.length).toBe(12);
        });

        it('Should allow a random sign to be chosen', function() {
            var sign = glitch.hiSigns.getRandomSign();
            expect(sign).not.toBeUndefined();
            expect(sign).toMatch(/^[a-zA-Z]+$/);
        });
    });

    describe('GlitchDate', function() {

        it('Should be a GlitchDate object initialised to the current date when not given a date', function() {
            var glitchDate = new glitch.GlitchDate();
            expect(glitchDate).toBeDefined();
            expect(glitchDate.year).toBeDefined();
            expect(glitchDate.year).toBeGreaterThan(0);
            expect(glitchDate.minute).toBeDefined();
            expect(glitchDate.minute).not.toBeLessThan(0);
            expect(glitchDate.minute).not.toBeGreaterThan(59);
        });

        it('Should be a GlitchDate object when given a date', function() {
            var date = new Date(1359974919022);
            var glitchDate = new glitch.GlitchDate(date);
            expect(glitchDate).toBeDefined();
            expect(glitchDate.year).toBeDefined();
            expect(glitchDate.year).toBeGreaterThan(0);
            expect(glitchDate.minute).toBeDefined();
            expect(glitchDate.minute).not.toBeLessThan(0);
            expect(glitchDate.minute).not.toBeGreaterThan(59);
        });

        it('Should return the date as a string', function() {
            var date = new Date(1359974919022);
            var glitchDate = new glitch.GlitchDate(date);

            var asString = glitchDate.toString();

            expect(asString).toBe('10:51am Theday, the 14th of Fever, Year 27');
        });

        it('Should give the time until next Moonday', function() {
            var date = new Date(1359974919022);
            var glitchDate = new glitch.GlitchDate(date);

            var nextMoonday = glitchDate.timeUntilMoonday();

            expect(nextMoonday).toBeDefined();
            expect(nextMoonday.glitch).toBeDefined();
            expect(nextMoonday.real).toBeDefined();
            expect(nextMoonday.glitch.minutes).not.toBeLessThan(0);
            expect(nextMoonday.glitch.minutes).not.toBeGreaterThan(59);
            expect(nextMoonday.real.minutes).not.toBeLessThan(0);
            expect(nextMoonday.real.minutes).not.toBeGreaterThan(59);

        });
    });

});