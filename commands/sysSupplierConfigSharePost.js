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
			downloadSpeedLimit = _data.downloadSpeedLimit,
			registerDiskSpace = _data.registerDiskSpace,
		 	path = "./config/config.json";

		//update config
		nconf.argv().env().file({ file: path });
		nconf.set('download_speed_limit',downloadSpeedLimit);
		nconf.set('registerDiskSpace',registerDiskSpace);
  		nconf.save(function(err)
  		{
  			if(err)
  			{
  				_data._result.result = 0;
  				_data._result.message = "modify error";
  				console.log(err);
  			}

  			_data._result.result = 1;
  			_data._result.message = "modify ok";

		 	_callback(false,job);
	  	});
	},

	that = 
	{
		init: init,
		execute: execute
	};

	return that;
}