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
		 	postUrl = "restore_setting",
		 	input,
		 	data = _data.data;

		//set header
		for(var key in _data.agentHeader)
		{
			client.headers[key] = _data.agentHeader[key];
		}
	
		if(data.path == "backup")
		{
			postUrl = "backup_setting";
			input = 
			{
				"enable":data.enable,
				"period":data.period,
				"backup":
				{					
					"real":data.real,
					"virtual":data.virtual,
				}
			}	
		}
		else
		{
			postUrl = "restore_setting";
			input = 
			{
				"restore":
				{					
					"real":data.real,
					"virtual":data.virtual,
					"owner":[]
				}
			}	
		}

		//post data
		client.post(postUrl, input,function(err, res, body) 
		{
			if(err)
			{
				console.log(err);
				_data._result.result = 0;
				_data._result.message = "upadte error";
				console.log("---------------upadte error(1)-----------------");
			}
			else
			{
				console.log(body);
				if(body.result == 1)
				{
					console.log("---------------upadte success-----------------");
					_data._result.result = 1;
					_data._result.message = "upadte success";
					
				}
				else
				{
					console.log("---------------upadte error(2)-----------------");
					_data._result.result = 0;
					_data._result.message = "upadte error";
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