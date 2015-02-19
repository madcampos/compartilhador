/*jshint node:true, devel:true*/
'use strict';
const PORT = 1337;
const FILE_PART_SIZE = 32 * 1024; //32kb

let console = require('better-console');
let entity = 'client';
let fs = require('fs');
let upnp = require('nat-upnp').createClient();
let externalIp;

upnp.portMapping({
	public: 12345,
	private: 54321,
	ttl: 10
}, function(err) {
	if (err) {
		console.error('Error: %s', err);
	} else {
		console.info('UPnP port mapping OK');
		upnp.externalIp(function(err, ip){
			if (err) {
				console.error('Error: %s', err);
			} else {
				externalIp = ip;
				console.info('UPnP ip is: %s', externalIp);
				
			}
		});
	}
});

//TODO: get server list from super server
//TODO: connect to a server based on heuristics