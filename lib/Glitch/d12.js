var giants = require('./giants').giants;

function D12() {
    this.sides = giants.concat('Rook'); // copy array, sides are all the giants + Rook
    this.currentResult = this.roll(); // choose a random side for starting with
}

D12.prototype.roll = function() {
    var max = this.sides.length - 1;
    var random = Math.random()*max;
    var index = Math.round(random);

    return this.sides[index];
};

D12.prototype.getCurrentResult = function() {
    return this.currentResult;
};

D12.prototype.getSides = function() {
    return this.sides.concat(); // returns a copy of the sides array
};

module.exports.D12 = D12;
