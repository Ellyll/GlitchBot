var hiSigns = [ 'Birds',
                'Flowers',
                'Stars',
                'Bats',
                'Hearts',
                'Cubes',
                'Hands',
                'HIs',
                'Rockets',
                'Butterflies',
                'Pigs',
		'Moons' // added for Mira, wasn't in Glitch
];


getRandomSign = function() {
  var max = hiSigns.length - 1;
  var random = Math.random()*max;
  var index = Math.round(random);

  return hiSigns[index];
}

exports.hiSigns = hiSigns;
exports.hiSigns.getRandomSign = getRandomSign;

