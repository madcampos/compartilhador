/*jshint node:true, devel:true*/
'use strict';
let peersList = [];
module.exports =  function(maxPeers, peerType){
	return {
		list: function(){
			return peersList;
		},
		add: function(peer){
			let index = peersList.findIndex(function(el){
				return el.address === peer.address;
			});

			if (peersList.length <= maxPeers) {
				if (index === -1) {
					peersList.push(peer);
				} else {
					return Error(peerType + ' alredy registered.');
				}
			} else {
				return new Error('Max connections limit reached.');
			}

			return true;
		},
		remove: function(peer){
			let index = peersList.findIndex(function(el){
				return el.address === peer.address;
			});

			if (index !== -1) {
				peersList.splice(index, 1);
			} else {
				return Error(peerType + ' not registered.');
			}

			return true;
		}
	};
};