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
		//backup
		client.get('backup_setting', function(err, res, body) 
		{
			if(err)
			{
				console.log(err);
				_data._result.result = 0;
				_data._result.message = "get backup setting error";
				console.log("-------------------get backup setting error(1)---------------------");
			}
			else
			{
				if(body.result == 1)
				{
					console.log("-------------------get backup setting ok---------------------");
					_data._result.data.backup = body.data;				
				}
				else
				{
					_data._result.result = 0;
					_data._result.message = "get backup setting error";
					console.log("-------------------get backup setting error(2)---------------------");
				}

				i++;
				check();
			}
		});	

		//retore
		client.get('restore_setting', function(err, res, body) 
		{
			if(err)
			{
				_data._result.result = 0;
				_data._result.message = "get restore setting error";
				console.log("-------------------get retore setting error(1)---------------------");
			}
			else
			{
				if(body.result == 1)
				{
					console.log("-------------------get retore setting ok---------------------");
					_data._result.result = 1;
					_data._result.message = "get retore setting ok";
					_data._result.data.restore = body.data;								
				}
				else
				{
					_data._result.result = 0;
					_data._result.message = "get retore setting error";
					console.log("-------------------get retore setting error(2)---------------------");
				}	

				i++;
				check();				
			}		
		});	

		check = function()
		{
			if(i == 2)
			{
				//console.log(_data._result.data);
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