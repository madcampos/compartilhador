/*jshint node:true, devel:true*/
'use strict';
module.exports = function(serverList) {
	//TODO: write heuristics for server choosing
	return serverList[0];
}