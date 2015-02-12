/*jshint node:true, devel:true*/
'use strict';
const PORT = 1337;
const MAX_CLIENTS = 1024;
const SERVER_UPDATE_TIMER = 1000 * 60 * 15 //15min
const SERVER_STABILIZATION_TIMER = 1000 * 60 * 3 //3min

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

let app = require('express')();
let bodyParser = require('body-parser');
let clients = require('./src/peerList')(MAX_CLIENTS, 'Client');
app.use(bodyParser.json());
app.disable('x-powered-by');
app.disable('etag');

app.get('/connect', function(req, res){
	//TODO: Client connect
});

app.post('/update/:server/:key',function(req, res){
	//TODO: handle updates from other servers
});

//TODO: make client connect to super-server and request serverlist
//TODO: send updates to servers based on locally keeped list of changes, than consolidate with other changes
/*
 * list of clients and their data: update and send diff
 * list of forigin clients with their data: recive diff and path
 * list of servers: broadcast to with diff from connected clients
 * merged list of clients: send to frontend on request for update
 * one server knows all the others and manteins one list from them but don't have direct access to the files or clients connected to them
 */

app.listen(PORT, function(){
	console.log('[%s] %s listening to port %d'.info, new Date().toISOString(), entity, PORT);
});

app.on('error', function(e){
	console.log('[%s] %s error:\n%s'.error, new Date().toISOString(), entity, e);
});