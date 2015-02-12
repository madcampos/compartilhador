/*jshint node:true, devel:true*/
'use strict';
const PORT = 1337;
const MAX_CLIENTS = 1024;
const SERVER_UPDATE_TIMER = 1000 * 60 * 15 //15min
const SERVER_STABILIZATION_TIMER = 1000 * 60 * 3 //3min

let colors = require('colors');

colors.setTheme({
	silly: 'rainbow',
	input: 'grey',
	verbose: 'cyan',
	prompt: 'grey',
	info: 'green',
	data: 'grey',
	help: 'cyan',
	warn: 'yellow',
	debug: 'blue',
	error: 'red'
});