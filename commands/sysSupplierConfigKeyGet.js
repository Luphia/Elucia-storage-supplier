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
		 	fs = require('fs');

		//set header
		for(var key in _data.agentHeader)
		{
			client.headers[key] = _data.agentHeader[key];
		}

		client.get('genkey', function(err, res, body) 
		{
			if(err)
			{
				_data._result.result = 0;
				_data._result.message = "gen key error";
				_callback(false,job);
			}
			else
			{				
				client.get('savekey', function(err, res, body) 
				{
					if(err)
					{
						_data._result.result = 0;
						_data._result.message = "save key error";
					}
					else
					{
						_data._result.result = 1;
						_data._result.message = "save key ok";

						fs.open("iServStorage.key","w",function(err,fd)
						{
							var jsonString = JSON.stringify(body);
							fs.write(fd,jsonString,0,'utf8',function(e)
							{								
						        if(e) 
						        	console.log(e);
						        else
						        {
						        	fs.closeSync(fd);					       
						        }
						        _callback(false,job);
						    })
						});						
					}				
				});			
			}		
		});
	},

	that = 
	{
		init: init,
		execute: execute
	};

	return that;
}