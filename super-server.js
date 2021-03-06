/*jshint node:true, devel:true*/
'use strict';
const PORT = 1337;
const MAX_SERVERS = 1024;

/*jshint -W079*/
let console = require('better-console');
/*jshint +W079*/

let entity = 'super-server';

let app = require('express')();
let bodyParser = require('body-parser');

let servers = require('./src/peerList')(MAX_SERVERS, 'Server');

let validate = require('./src/validate');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.disable('x-powered-by');
app.disable('etag');

app.all(function(req, res, next){
	res.header('Connection', 'Close');
	next();
});

app.get('/', function(req, res){
	console.log('Sending server list.');
	res.json(servers.list());
});

function register(req, res){
	if (req.body && req.body.address && req.body.key && req.body.intent) {
		if (validate(req.body.key)) {
			let errorMessage;
			switch (req.body.intent) {
				case 'register':
					errorMessage = servers.add({
						'address': req.body.address,
						'region': req.body.region || '',
						'metadata': req.body.metadata || []
					});
					console.log('Register:\n%s', req.body);
					break;
				case 'unregister':
					errorMessage = servers.remove({'address': req.body.address});
					console.log('Unregister:\n%s', req.body);
					break;
				default:
					errorMessage = 'Operation unknown.';
					break;
			}
			if (errorMessage instanceof Error) {
				res.status(400);
			} else {
				res.status(200);
			}
			console.log(servers.list());
			res.send(errorMessage.toString());
		} else {
			res.status(401).end();
		}
	} else {
		res.status(400).send('Bad parameters.');
	}
}

app.post('/register', register);

app.post('/unregister', register);

app.listen(PORT, function(){
	console.info('[%s] %s listening to port %d', new Date().toISOString(), entity, PORT);
});

app.on('error', function(e){
	console.error('[%s] %s error:\n%s', new Date().toISOString(), entity, e);
});