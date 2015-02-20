/*jshint node:true, devel:true*/
'use strict';
const PORT = 1337;
const FILE_PART_SIZE = 32 * 1024; //32kb

const SUPER_SERVER = '';
const SUPER_SERVER_PORT = 1337;

let console = require('better-console');
let entity = 'client';
let fs = require('fs');
let upnp = require('nat-upnp').createClient();
let externalIp;

upnp.portMapping({
	public: PORT,
	private: PORT,
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
				
			}
		});
	}
});

//TODO: get server list from super server
//TODO: connect to a server based on heuristics
function connectToServer(serverList){
	
}

function retriveServerList(){
	
	let opt = {
		host: SUPER_SERVER,
		port: SUPER_SERVER_PORT,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}
	};
	let req = http.request(opt, function(res){
		//TODO: querystring.stringify body
	});
	
	req.on('error', function(err){
		console.error('Server list request error: %s', err.message);
	});
}