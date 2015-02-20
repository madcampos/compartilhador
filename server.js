/*jshint node:true, devel:true*/
'use strict';
const PORT = 1338;
const MAX_CLIENTS = 1024;
const SERVER_UPDATE_TIMER = 1000 * 60 * 15; //15min
const SERVER_STABILIZATION_TIMER = 1000 * 60 * 3; //3min
const REGION = 'default';
const ADDRESS = require('dns').lookup(require('os').hostname(), function(err, addr){ return addr; });

let http = require('http');
/*jshint -W079*/
let console = require('better-console');
/*jshint +W079*/
let entity = 'server';

let ownClients = require('./src/peerList'); //TODO: use other structure
let otherClients = []; //TODO: use better structure
let servers = [];

let localCache = [];
let externalCache = [];

let app = require('express')();
let bodyParser = require('body-parser');
let clients = require('./src/peerList')(MAX_CLIENTS, 'Client');
let superServer = {
	hostname: 'localhost',
	port: 1337
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');
app.disable('etag');

app.post('/connect', function(req, res){
	//TODO: Client connect
	if (req.body && req.body.address && req.body.files) {
		let errorMessage = ownClients.add({
			address: req.body.address,
			server: req.ip,
			files: req.body.files
		});
		if (errorMessage instanceof Error) {
			res.status(400);
		} else {
			res.status(200);
		}
		res.send(errorMessage.toString());
	} else {
		res.status(400).send('Bad parameters.');
	}
});

app.post('/disconect', function(req, res){
	if (req.body && req.body.address) {
		let errorMessage = ownClients.remove({address: req.body.address});
		if (errorMessage instanceof Error) {
			res.status(400);
		} else {
			res.status(200);
		}
		res.send(errorMessage.toString());
	} else {
		res.status(400).send('Bad parameters.');
	}
});

app.post('/update',function(req, res){
	//TODO: handle updates from other servers
});

//TODO: send updates to servers based on locally keeped list of changes, than consolidate with other changes
/*
 * list of clients and their data: update and send diff
 * list of forigin clients with their data: recive diff and path
 * list of servers: broadcast to with diff from connected clients
 * merged list of clients: send to frontend on request for update
 * one server knows all the others and manteins one list from them but don't have direct access to the files or clients connected to them
 */

function connectToSuperServer(){
	let msg = JSON.stringify({
		address: `${ADDRESS}:${PORT}`,
		region: REGION,
		intent: 'connect',
		key: 'keystub'
	});

	let opt = {
		host: superServer.hostname,
		port: superServer.port,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': msg.length
		}
	};

	let req = http.request(opt);
	req.write(msg);
	req.end();
	
	req.on('end', function(){
		console.info('Super server connection ok.');
	});

	req.on('error', function(err){
		console.error('Super server connect error: %s', err.message);
	});
}

function retrieveServerList(){
	http.get({host: superServer.hostname, port: superServer.port}, function(res){
		let data = '';
		res.setEncoding('utf8');

		res.on('data', function(chunk){
			data += chunk;
		});

		res.on('end', function(){
			//TODO: make update to servers variable;
			JSON.parse(data).forEach(function(el){
				if (!servers.includes(el)) {
					servers.push(el);
				}
			});
		});
	}).on('error', function(err){
		console.error('Server list request error: %s', err.message);
	});
}

app.listen(PORT, function(){
	console.info('[%s] %s listening to port %d', new Date().toISOString(), entity, PORT);
});

app.on('error', function(e){
	console.error('[%s] %s error:\n%s', new Date().toISOString(), entity, e);
});