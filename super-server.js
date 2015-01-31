/*jshint browser:false, node:true*/
'use strict';

const PORT = 1337;
const MAX_SERVERS = 1024;

var express = require('express');
var app = express();
var colors = require('colors');

var servers = [MAX_SERVERS];

var validate = require('./src/validate.js');

app.get('/', function(req, res){
	//TODO: send server list
});

app.post('/register', function(req, res){
	//TODO: get post data containing hash and negotiate association
});

app.post('/unregister', function(req, res){
	//TODO: get post data containig hash and deassociate updating list of servers
});

app.put('/server', function(req, res){
	//TODO: validate admin hash and save new server
});

app.delete('/server', function(req, res){
	//TODO: validate admin and remove server
});

app.on('listening', function(){
	console.log('[%s] Server listening to port %d'.green, new Date().toISOString(), PORT);
});

app.on('error', function(e){
	console.log('[%s] Server error:\n'.red.bold + e.toString().red, new Date().toISOString());
});

app.listen(PORT);