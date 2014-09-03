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
		var ip = _data._config.agent.ip,
			port = _data._config.agent.port,
			request = require('request-json'),
		 	client = request.newClient('http://'+ip+':'+port+'/'),
		 	path = 'listlocaldir/';

		if(typeof _data.path != "undefined")
			path += _data.path;

		//set header
		for(var key in _data.agentHeader)
		{
			client.headers[key] = _data.agentHeader[key];
		}

		client.get(path, function(err, res, body) 
		{
			if(err)
			{
				console.log(err);
				_data._result.result = 0;
				_data._result.message = "get listlocaldir error";
			}
			else
			{console.log(body.data);
				_data._result.result = 1;
				_data._result.message = "get listlocaldir ok";
				_data._result.data = body.data;
			}
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