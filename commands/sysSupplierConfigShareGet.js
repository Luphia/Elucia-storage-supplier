module.exports = function()
{
	var job,

	init = function(_job)
	{
		job = _job;
		return this;
	},

	execute = function(_data, _callback)
	{
		var nconf = require('nconf'),
		 	path = "./config/config.json",
		 	downloadSpeedLimit,
		 	registerDiskSpace;

		//get config
		nconf.argv().env().file({ file: path });
		_data._result.data.downloadSpeedLimit = nconf.get('download_speed_limit');
		_data._result.data.registerDiskSpace = nconf.get('registerDiskSpace');	

		_data._result.result = 1;
		_data._result.messgae = "get config ok";

		_callback(false,job);
	}
		

	that = 
	{
		init: init,
		execute: execute
	};

	return that;
}