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
		 	postUrl = "backup_setting",
		 	input = 
		 	{
		 		"backup_now":true
		 	};

		//set header
		for(var key in _data.agentHeader)
		{
			client.headers[key] = _data.agentHeader[key];
		}

		//post data
		client.post(postUrl, input,function(err, res, body) 
		{
			if(err)
			{
				console.log(err);
				_data._result.result = 0;
				_data._result.message = "backup error(1)";
				console.log("-----------------backup error(1)----------------");
			}
			else
			{
				console.log(body);

				if(body.result == 1)
				{
					_data._result.result = 1;
					_data._result.message = "backup success";
					console.log("-----------------backup success----------------");
				}
				else
				{
					console.log("-----------------backup error(2)----------------");
					_data._result.result = 0;
					_data._result.message = "backup error";
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