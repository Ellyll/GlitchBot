GlitchBot
=========

About
-----
GlitchBot is a [Node.js](http://nodejs.org/) and node-irc based IRC bot, themed after the game Glitch by [Tiny Speck](http://tinyspeck.com/). It's still work in progress, but is quite usable in it's current form.

Features
--------
The following commands are currently supported:
!hug !say !emote !date !day !moon !dance !kiss !splank !poke !hi !moonday !roll !race
!quit is also supported on the console only

From the console 

It also announces new Glitch days (and moons everyone on Moonday).

Using
-----
You'll need to have Node.js installed. Once you have it, checkout the source and install node-irc with npm e.g.

	git clone https://github.com/Ellyll/GlitchBot.git
	cd GlitchBot
	npm install node-irc

You'll then need to create a config.js file (see config.example.js).

Start the bot with:

	node bot.js

TODO
----
* Turn it into a node module so it can just be installed with npm.
* Generate the distance a cubimal races using a probablity distribution e.g. a bell curve.
