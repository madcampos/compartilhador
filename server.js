/*jshint node:true, devel:true*/
'use strict';
const PORT = 1337;
const MAX_CLIENTS = 1024;
const SERVER_UPDATE_TIMER = 1000 * 60 * 15 //15min
const SERVER_STABILIZATION_TIMER = 1000 * 60 * 3 //3min
const SUPER_SERVER = '';

let console = require('better-console');
let entity = 'server';

let ownClients = require('./src/peerList'); //TODO: use other structure
let otherClients = []; //TODO: use better structure
let servers = []; //TODO: use better structure

let localCache = [];
let externalCache = [];

let app = require('express')();
let bodyParser = require('body-parser');
let clients = require('./src/peerList')(MAX_CLIENTS, 'Client');
app.use(bodyParser.json());
app.disable('x-powered-by');
app.disable('etag');

app.post('/connect', function(req, res){
	//TODO: Client connect
	if (req.body && req.body.address && req.body.files) {
		let errorMessage = ownClients.add({
			address: req.body.address, //UPnP Address
			server: req.ip,
			files: req.body.files
		});
		if (errorMessage instanceof Error) {
			res.status(400).send(errorMessage);
		} else {
			res.status(200).end();
		}
	} else {
		res.status(400).end();
	}
});

app.post('/disconect', function(req, res){
	if (req.body && req.body.address) {
		let errorMessage = ownClients.remove({address: req.body.address});
		if (errorMessage instanceof Error) {
			res.status(400).send(errorMessage);
		} else {
			res.status(200).end();
		}
	} else {
		res.status(400).end();
	}
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

//TODO: get server list from super server

app.listen(PORT, function(){
	console.info('[%s] %s listening to port %d', new Date().toISOString(), entity, PORT);
});

app.on('error', function(e){
	console.error('[%s] %s error:\n%s', new Date().toISOString(), entity, e);
});