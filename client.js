/*jshint node:true, devel:true*/
'use strict';
const PUBLIC_PORT = 13337;
const PRIVATE_PORT = 73331;
const FILE_PART_SIZE = 32 * 1024; //32kb

let path = require('path');
const FILES_FOLDER = path.join(process.env.HOME, '/compartilhador');
let fs = require('fs');
let crypto = require('crypto');

let app = require('express')();
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');
app.disable('etag');

let superServer = {
	hostname: '192.168.5.227',
	port: 1337
};

/*jshint -W079*/
let console = require('better-console');
/*jshint +W079*/

let entity = 'client';

let http = require('http');
let upnp = require('nat-upnp').createClient();
let client = {
	externalIp: '',
	externalPort: '',
	localIp: '',
	localPort: '',
	fileList: []
};
let server;

upnp.portMapping({
	public: PUBLIC_PORT,
	private: PRIVATE_PORT,
	ttl: 1024
}, function(err) {
	if (err) {
		console.error('UPnP Port Mapping error: %s', err);
		listFiles(connectToServer);
	} else {
		console.info('UPnP port mapping OK');
		upnp.externalIp(function(err, ip){
			if (err) {
				console.error('External IP Retriving error: %s', err);
			} else {
				client.externalIp = ip;
				upnp.getMappings(function(err, results){
					if (err) {
						console.error('UPnP mapping error: %s', err);
					} else {
						let mapping = results.find(function(el){
							return el.description === 'node:nat:upnp';
						});
						
						client.externalPort = mapping.public.port;
						client.localPort = mapping.private.port;
						client.localIp = mapping.private.host;
						
						console.info('%s UPnP address is: %s:%s (%s:%s)', entity, client.externalIp, client.externalPort, client.localIp, client.localIp);
						app.listen(client.localPort, function(){
							console.info('%s listening to local port at: %s', entity, client.localPort);
						});
						//TODO: remove
						listFiles(connectToServer);
					}
				});
			}
		});
	}
});

function listFiles(next){
	console.info('Hashing files...');
	fs.readdir(FILES_FOLDER, function(err, dir){
		if (err) {
			fs.mkdirSync(FILES_FOLDER);
			dir = fs.readdirSync(FILES_FOLDER);
		}
		
		dir.forEach(function(el, idx){
			let file = {};
			file.name = el;
			file.path = path.join(FILES_FOLDER, file.name);
			file.buffer = fs.readFileSync(file.path);
			file.size = file.buffer.length;
			file.parts = {
				size: Math.ceil(file.size/FILE_PART_SIZE)
			};
			file.parts.hashes = new Array(file.parts.size);
			file.hash = crypto.createHash('md5').update(file.buffer).digest('base64');
			
			for (let part = 0; part < file.parts.size; part++) {
				file.parts.hashes[part] = crypto.createHash('md5').update(file.buffer.slice(part * FILE_PART_SIZE, part * FILE_PART_SIZE + FILE_PART_SIZE)).digest('base64');
			}
			
			client.fileList.push(file);
		});
		
		console.info('Hashing done.');
		console.log(client.fileList);
		next();
	});
}

function connectToServer(){
	console.info('Starting connection to server...');
	server = require('url').parse(require('./src/chooseServer')(retrieveServerList()), false);
	console.log(server);
	
	let msg = JSON.stringify({
		address: `${client.externalIp}:${client.externalPort}`,
		files: client.fileList.filter(function(el){
			return {
				name: el.name,
				size: el.size,
				parts: el.parts,
				hash: el.hash
			}
		})
	});
	
	let opt = {
		host: server.hostname,
		port: server.port,
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
		console.info('Server connection ok.');
	});

	req.on('error', function(err){
		console.error('Server connect error: %s', err.message);
	});
}

function retrieveServerList(){
	console.info('Retrieving server list...');
	http.get({host: superServer.hostname, port: superServer.port}, function(res){
		let data = '';		
		res.setEncoding('utf8');
		
		res.on('data', function(chunk){
			data += chunk;
		});
		
		res.on('end', function(){
			console.info('Got server list.');
			console.log(data);
			return data;
		});
	}).on('error', function(err){
		console.error('Server list request error: %s', err.message);
	});
}

app.get('/', function(req, res){
	if (req.body && req.body.hash && req.body.part) {
		//TODO: handle file request
		let file = client.fileList.find(function(el){
			return el.hash === req.body.hash;
		});
		
		res.send(file.buffer.toString('base64',req.body.part * FILE_PART_SIZE, req.body.part * FILE_PART_SIZE + FILE_PART_SIZE));
	}
});

app.on('error', function(e){
	console.error('%s error:\n%s', entity, e);
});