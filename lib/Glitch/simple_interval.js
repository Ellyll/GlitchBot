var  SimpleInterval = function(days, hours, minutes, seconds) {
    this.days = typeof days === 'undefined' ? 0 : days;
    this.hours = typeof hours === 'undefined' ? 0 : hours;
    this.minutes = typeof minutes === 'undefined' ? 0 : minutes;
    this.seconds = typeof seconds === 'undefined' ? 0 : seconds;
};

SimpleInterval.prototype.toString = function() {
    var time = "";

    if (this.days > 0) {
        time += this.days + ' day' + ((this.days !== 1) ? 's' : '') + ' ';
    }
    if (this.hours > 0) {
        time += this.hours + ' hour' + ((this.hours !== 1) ? 's' : '') + ' ';
    }
    if (this.minutes > 0) {
        time += this.minutes + ' minute' + ((this.minutes !== 1) ? 's' : '') + ' ';
    }
    if (this.seconds > 0) {
        time += this.seconds + ' second' + ((this.seconds !== 1) ? 's' : '');
    }
    time = time.trim();

    return time;
};

module.exports.SimpleInterval = SimpleInterval;
