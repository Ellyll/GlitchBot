var SimpleInterval = require('./../simple_interval');

var months = [
		{ name: 'Primuary', days: 29 },
		{ name: 'Spork', days: 3 },
		{ name: 'Bruise', days: 53 },
		{ name: 'Candy', days: 17 },
		{ name: 'Fever', days: 73 },
		{ name: 'Junuary', days: 19 },
		{ name: 'Septa', days: 13 },
		{ name: 'Remember', days: 37 },
		{ name: 'Doom', days: 5 },
		{ name: 'Widdershins', days: 47 },
		{ name: 'Eleventy', days: 11 },
		{ name: 'Recurse', days: 1 }
];

var days = [
		'Hairday',
		'Moonday',
		'Twoday',
		'Weddingday',
		'Theday',
		'Fryday',
		'Standday',
		'Fabday'
];

var GlitchDate = function(realDate) {
  if (!realDate) {
    this._realDate = new Date();
  } else {
    this._realDate = realDate;
  }

  var _glitchDate = this._getDate(this._realDate);
  this.year = _glitchDate.year;
  this.dayOfYear = _glitchDate.dayOfYear;
  this.hour = _glitchDate.hour;
  this.minute = _glitchDate.minute;
  this.dayOfWeek = _glitchDate.dayOfWeek;
  this.month = _glitchDate.month;
  this.dayOfMonth = _glitchDate.dayOfMonth;
};

GlitchDate.prototype._getDate = function(realDate) {
  var ts = Math.round(realDate.getTime() / 1000);

  var sec = ts - 1238562000;

  // there are 4435200 real seconds in a game year
  // there are 14400 real seconds in a game day
  // there are 600 real seconds in a game hour
  // there are 10 real seconds in a game minute

  var year = Math.floor(sec / 4435200);
  sec -= year * 4435200;

  var day_of_year = Math.floor(sec / 14400);
  sec -= day_of_year * 14400;

  var hour = Math.floor(sec / 600);
  sec -= hour * 600;

  var minute = Math.floor(sec / 10);
  sec -= minute * 10;

  var days_since_epoch = day_of_year + (307 * year);
  var day_of_week = { day : days_since_epoch % 8,
	              name : days[days_since_epoch % 8] };

  var monthDay = this._dayToMonthDay(day_of_year);
  var month = monthDay[0];
  var day_of_month = monthDay[1];

  return { 
          "year" : year,
          dayOfYear : day_of_year,
          "hour" : hour,
          "minute" : minute,
          dayOfWeek : day_of_week,
          "month" : month,
          dayOfMonth : day_of_month
         };
};


GlitchDate.prototype.toString = function() {

  var timeString = ':' + (this.minute < 10 ? '0' + this.minute : this.minute );
  if ( this.hour > 12 ) {
    timeString = (this.hour - 12) + timeString + 'pm';
  } else {
    timeString =  this.hour + timeString + 'am';
  }

  var dateTimeString = timeString + ' ' + this.dayOfWeek.name +
                       ', the ' + this._addOrdinal(this.dayOfMonth) + ' of ' + this.month.name +
		       ', Year ' + this.year;

  return dateTimeString;
};

// Get month and day of month from day of year
GlitchDate.prototype._dayToMonthDay = function(id) {
        //var months = [ 29, 3, 53, 17, 73, 19, 13, 37, 5, 47, 11, 1 ];
        var cd = 0;

        for (var i=0; i<months.length; i++) {
                cd += months[i].days;
                if (cd > id){
                        var m = i+1;
                        var d = id+1 - (cd - months[i].days);
                        return [months[m-1],d];
                }
        }

        return [0,0];
};

GlitchDate.prototype._addOrdinal = function(number) {
    var n = number % 100;
    var suffix = ['th', 'st', 'nd', 'rd', 'th'];
    var ord = n < 21 ? (n < 4 ? suffix[n] : suffix[0]) : (n % 10 > 4 ? suffix[0] : suffix[n % 10]);
    return number + ord;
};

// Get number of glitch minutes until next Moonday
GlitchDate.prototype.minutesUntilMoonday = function() {
    // mins until next Moonday = (glitch days until Moonday * 24 * 60) - glitch minutes of today
    var moonday = 1; // Moonday is 2nd element in days array
    var daysUntilMoonday = (moonday - this.dayOfWeek.day) + (this.dayOfWeek.day >= moonday ? 8 : 0);

    // take off seconds already passed today
    var todayMins = (this.hour * 60) + this.minute;

    return (daysUntilMoonday * 24 * 60) - todayMins;
};

GlitchDate.prototype.timeUntilMoonday = function() {
    var mins = this.minutesUntilMoonday();
    var realMins = Math.floor(mins / 6);

    var days = Math.floor(mins / (60*24));
    mins -= days * 60 * 24;

    var hours = Math.floor(mins/60);
    mins -= hours * 60;

    var realDays = Math.floor(realMins / (60*24));
    realMins -= realDays * 60 * 24;

    var realHours = Math.floor(realMins/60);
    realMins -= realHours * 60;

    var glitchInterval = new SimpleInterval.SimpleInterval(days, hours, mins);
    var realInterval = new SimpleInterval.SimpleInterval(realDays, realHours, realMins);

    return { real : realInterval, glitch : glitchInterval };
};

module.exports.GlitchDate = GlitchDate;
