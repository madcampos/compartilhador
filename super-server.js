/*jshint node:true, devel:true*/
'use strict';
let colors = require('colors');
let entity = 'super-server'

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

let servers = require('./src/peerList')(MAX_SERVERS, 'Server');

let validate = require('./src/validate');

app.use(bodyParser.json());
app.disable('x-powered-by');
app.disable('etag');

app.all(function(req, res, next){
	res.header('Connection', 'Close');
	next();
});

app.get('/', function(req, res){
	console.log(req.rawHeaders);
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
	console.log('[%s] %s listening to port %d'.info, new Date().toISOString(), entity, PORT);
});

app.on('error', function(e){
	console.log('[%s] %s error:\n%s'.error, new Date().toISOString(), entity, e);
});