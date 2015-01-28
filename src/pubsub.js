var http = require('http');

//TODO: criar servidor de escuta a requisições
/**
 * Structure
 */
var subscribers = [];
var subscribeds = [];

/**
 * Publish to the selected source
 * @param {String} to - The Address to publish
 * @param {Number} status - The status code of the message
 * @param {Object} [options] - Options to the message
 */
exports.publish = function(){
	
}

/**
 * Subscribe to the selected source
 * @param {String} to - The address to subscribe
 * @param {String} [as=ENTITY] - The type of the entity
 * @param {Object} [options] - Options to the subscription
 */
exports.subscribe = function(){
	
}

/**
 * Unsubscribe from the selected source
 * @param {String} [from] - The adress to unsubscribe
 */
exports.unsubscribe = function(){
	
}

/**
 * Get the subscribers list
 */
exports.getSubscribers = function(){
	
}

/**
 * Get subscribeds list
 */
exports.getSubscribeds = function(){
	
}

/**
 * Init the listener server
 * @param {Number} port - The port to listen to
 */

exports.initListener = function(){
	
}