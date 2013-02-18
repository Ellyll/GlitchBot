// retrieved by running the following jQuery code on http://www.glitch.com/items/collectibles/
// $("h3:contains('Cubimal')").each(function(index) { console.log('index: ' + $(this).text()); var cubis = []; $(this).next().find('span.item-name').each(function(idx) { cubis.push($(this).text());}); console.log(JSON.stringify(cubis)); });
var series1 = [
    "Batterfly Cubimal",
    "Bureaucrat Cubimal",
    "Butterfly Cubimal",
    "Cactus Cubimal",
    "Chick Cubimal",
    "Crab Cubimal",
    "Deimaginator Cubimal",
    "Dustbunny Cubimal",
    "Firefly Cubimal",
    "Frog Cubimal",
    "Greeterbot Cubimal",
    "Gwendolyn Cubimal",
    "Helga Cubimal",
    "JuJu Cubimal",
    "Magic Rock Cubimal",
    "Piggy Cubimal",
    "Rook Cubimal",
    "Rube Cubimal",
    "Smuggler Cubimal",
    "Sno Cone Vendor Cubimal",
    "Squid Cubimal",
    "Uncle Friendly Cubimal",
    "Yeti Cubimal"
];

var series2 = [
    "Butler Cubimal",
    "Craftybot Cubimal",
    "Emo-Bear Cubimal",
    "Firebog Street Spirit Cubimal",
    "Fox Cubimal",
    "Fox Ranger Cubimal",
    "Gardening Tools Vendor Cubimal",
    "Gnome Cubimal",
    "Groddle Street Spirit Cubimal",
    "Hell Bartender Cubimal",
    "Ilmenskie Jones Cubimal",
    "Maintenance Bot Cubimal",
    "Meal Vendor Cubimal",
    "Phantom Cubimal",
    "Scion of Purple Cubimal",
    "Señor Funpickle Cubimal",
    "Sloth Cubimal",
    "Tool Vendor Cubimal",
    "Trisor Cubimal",
    "Uralia Street Spirit Cubimal"
];

var cubimals = {
    "series1" : series1,
    "series2" : series2,
    getRandomCubimal: function() {
        var series = Math.round(Math.random()) === 0 ? this.series1 : this.series2;

        var max = series.length - 1;
        var random = Math.random()*max;
        var index = Math.round(random);

        return series[index];
    }
};

exports.cubimals = cubimals;