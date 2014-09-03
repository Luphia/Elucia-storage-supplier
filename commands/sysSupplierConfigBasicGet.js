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
		 	client = request.newClient('http://'+ip+':'+port+'/');

		 //set header
		for(var key in _data.agentHeader)
		{
			client.headers[key] = _data.agentHeader[key];
		}
		

		var i = 0;
		client.get('basic_setting', function(err, res, body) 
		{
			if(err)
			{
				console.log(err);
				_data._result.result = 0;
				_data._result.message = "get basic setting error";
				_callback(false,job);
			}
			else
			{
				_data._result.data.basic = body.data;
				console.log(body.data);
				i++;
				check();
			}
		});

		client.get('backup_setting', function(err, res, body) 
		{
			if(err)
			{
				console.log(err);
				_data._result.result = 0;
				_data._result.message = "get backup setting error";
				_callback(false,job);
			}
			else
			{
				_data._result.result = 1;
				_data._result.message = "get backup setting ok";
				_data._result.data.backup = body.data;
				_data._result.data.uploadPath = _data._config.uploadPath;
				
				i++;
				check();
			}
		});	

		check = function()
		{
			if(i == 2)
			{
				console.log("----------------get basic setting ok----------------");
				_callback(false,job);
			}			
		}
	},

	that = 
	{
		init: init,
		execute: execute
	};

	return that;
}