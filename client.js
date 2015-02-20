/*jshint node:true, devel:true*/
/*global querystring*/
'use strict';
const PUBLIC_PORT = 13337;
const PRIVATE_PORT = 73331;
const FILE_PART_SIZE = 32 * 1024; //32kb

let superServer = {
	hostname: 'localhost',
	port: 1337
};

let console = require('better-console');

let entity = 'client';

let http = require('http');
let upnp = require('nat-upnp').createClient();
let externalIp;
let client = {
	externalIp: undefined,
	fileList: []
};
let server;

upnp.portMapping({
	public: PUBLIC_PORT,
	private: PRIVATE_PORT,
	ttl: 10
}, function(err) {
	if (err) {
		console.error('UPnP Port Mapping error: %s', err);
	} else {
		console.info('UPnP port mapping OK');
		upnp.externalIp(function(err, ip){
			if (err) {
				console.error('External IP Retriving error: %s', err);
			} else {
				externalIp = ip;
				console.info('UPnP ip is: %s', externalIp);
				console.info('Starting connection to server...');
				connectToServer();
			}
		});
	}
});

function connectToServer(){
	server = require('url').parse(require('./serc/chooseServer')(retriveServerList()), false);
	
	let msg = querystring.stringify({
		address: client.externalIp,
		files: client.fileList
	});
	
	let opt = {
		host: server.hostname,
		port: server.port,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': msg.length
		}
	};
	
	let req = http.request(opt);
	req.write(msg);
	req.end();

	req.on('error', function(err){
		console.error('Server connect error: %s', err.message);
	});
}

function retriveServerList(){
	http.get({host: superServer.hostname, port: superServer.port}, function(res){
		let data = '';		
		res.setEncoding('utf8');
		
		res.on('data', function(chunk){
			data += chunk;
		});
		
		res.on('end', function(){
			return data;
		});
	}).on('error', function(err){
		console.error('Server list request error: %s', err.message);
	});
}