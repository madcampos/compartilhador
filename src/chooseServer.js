/*jshint node:true, devel:true*/
'use strict';
module.exports = function(err, serverList) {
	//TODO: write heuristics for server choosing
	let server = {
		hostname: 'localhost',
		port: '1338'
	};
	
	if (serverList) {
		server.hostname = serverList[0].hostname;
		server.port = serverList[0].port;
	}
	
	return `http://${server.hostname}:${server.port}`;
};