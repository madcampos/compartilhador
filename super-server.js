/*jshint node:true, devel:true*/
'use strict';
const PORT = 1337;
const MAX_SERVERS = 1024;
const SERVER_UPDATE_TIMER = 1000 * 60 * 15 //15min
const SERVER_STABILIZATION_TIMER = 1000 * 60 * 3 //3min

let console = require('better-console');
let entity = 'super-server'

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

app.post('/unregister', register);

app.listen(PORT, function(){
	console.info('[%s] %s listening to port %d', new Date().toISOString(), entity, PORT);
});

app.on('error', function(e){
	console.error('[%s] %s error:\n%s', new Date().toISOString(), entity, e);
});