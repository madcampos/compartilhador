/*jshint node:true, devel:true*/
'use strict';
let colors = require('colors');
let entity = 'server';

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

const PORT = 1337;
const MAX_CLIENTS = 1024;

let app = require('express')();
let bodyParser = require('body-parser');
let clients = require('./src/peerList')(MAX_CLIENTS, 'Client');
app.use(bodyParser.json());
app.disable('x-powered-by');
app.disable('etag');

app.get('/connect', function(req, res){
	
});

app.listen(PORT, function(){
	console.log('[%s] %s listening to port %d'.info, new Date().toISOString(), entity, PORT);
});

app.on('error', function(e){
	console.log('[%s] %s error:\n%s'.error, new Date().toISOString(), entity, e);
});