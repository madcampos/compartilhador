/*jshint node:true, devel:true*/
'use strict';
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

const PORT = 1337;
const MAX_SERVERS = 1024;

let app = require('express')();
let bodyParser = require('body-parser');

let servers = (function(){
	let serverList = [];
	
	return {
		list: function(){
			return serverList;
		},
		add: function(server){
			let index = serverList.findIndex(function(el){
				return el.address === server.address;
			});
			
			if (serverList.length <= MAX_SERVERS) {
				if (index === -1) {
					serverList.push(server);
				} else {
					return Error('Server alredy revistered.');
				}
			} else {
				return new Error('Max server limit.');
			}
			
			return true;
		},
		remove: function(server){
			let index = serverList.findIndex(function(el){
				return el.address === server.address;
			});
			
			if (index !== -1) {
				serverList.splice(index, 1);
			} else {
				return Error('Server not registered.');
			}
			
			return true;
		}
	};
})();

let validate = require('./src/validate.js');

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.json(servers.list());
});

function register(req, res){
	if (req.body && req.body.address && req.body.key && req.body.region && req.body.metadata) {
		if (validate(req.body.key)) {
			let errorMessage;
			switch (req.body.intent) {
				case 'register':
					errorMessage = servers.add({
						'address': req.body.address,
						'region': req.body.region,
						'metadata': req.body.metadata
					});
					break;
				case 'unregister':
					errorMessage = servers.remove({
						'address': req.body.address,
						'region': req.body.region,
						'metadata': req.body.metadata
					});
					break;
				default:
					errorMessage = 'Operation unknown.';
					break;
			}
			if (errorMessage instanceof Error) {
				res.status(400).send(errorMessage);
			} else {
				res.status(200).end();
			}
		} else {
			res.status(401).end();
		}
	}
	
	res.status(400).end();
}

app.post('/register', register);
app.put('/server', register);

app.post('/unregister', register);
app.delete('/server', register);

app.listen(PORT, function(){
	console.log('[%s] Server listening to port %d'.info, new Date().toISOString(), PORT);
});

app.on('error', function(e){
	console.log('[%s] Server error:\n'.error + e.toString().data, new Date().toISOString());
});