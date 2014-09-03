
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ¿À¨d VM
	execute = function(_data, callBack){
		console.log("####### in function storageInfoSync ######## ");
		
		// get config
		var serverIP = _data._config.serverIP;
		var storageDevice = _data._config.storageDevice;
		
		// callBack
		var postData = function(data) {			
			callBack(false,job);		
		}
		
		// post info to server
		var getDisk = function(total, free, status) {
			_data._result.total_disk = total;
			_data._result.free_disk = free;
			_data._result.status = status;
			
			// get os info
			var os = require('os');
			_data._result.hostname = os.hostname();
			_data._result.platform = os.platform();
			_data._result.uptime = os.uptime();
			_data._result.loadavg = os.loadavg();
			_data._result.totalmem = os.totalmem();
			_data._result.freemem = os.freemem();
			_data._result.cpus = os.cpus();
			_data._result.networkInterfaces = os.networkInterfaces();
			
			var params = {
				"total_disk":total, //bytes
				"free_disk":free,   //bytes
				"status":status,			
				"hostname":os.hostname(),
				"platform":os.platform(),
				"uptime":os.uptime(),
				"loadavg":os.loadavg(),
				"totalmem":os.totalmem(),
				"freemem":os.freemem(),
				"cpus":os.cpus(),
				"networkInterfaces":os.networkInterfaces(),			
			}
			console.log(_data._result);
			// post to Center
			// var post = require( './posturl.js' );
			// try{
				// post.posturl("storageInfoSync", "", serverIP, params, postData);
			// }catch(e){
				// callBack(e);
			// }
			
			callBack(false,job);
		}
		
		// getDisk info
		var diskspace = require('diskspace');
		try{
			diskspace.check(storageDevice, getDisk);
		}catch(e){
			callBack(e);
		}

	},

	that = {
		init: init,
		execute: execute
	};
	return that;
}