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
		 	url = _data.url;

		//set header
		for(var key in _data.agentHeader)
		{
			client.headers[key] = _data.agentHeader[key];
		}

		//list backup task
		client.get(url, function(err, res, body) 
		{
			if(err)
			{
				console.log(err);
				_data._result.result = 0;
				_data._result.message = "get mission error";
			}
			else
			{
				if(body.result == 0)
				{
					_data._result.result = 0;
					_data._result.message = "get mission error";
				}
				else
				{
					_data._result.result = 1;
					_data._result.message = "get mission ok";
					_data._result.data = body.data;					
				}			
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