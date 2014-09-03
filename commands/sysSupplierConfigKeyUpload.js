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
		var	nconf = require('nconf'),
			ip = _data._config.agent.ip,
			port = _data._config.agent.port,
			request = require('request-json'),
		 	client = request.newClient('http://'+ip+':'+port+'/');

		//set header
		for(var key in _data.agentHeader)
		{
			client.headers[key] = _data.agentHeader[key];
		}

		nconf.argv().env().file({ file: _data.key.key.path });

		var encryptKey = nconf.get('encrypt_key');
		if(typeof encryptKey == "undefined")
		{
			_data._result.result = 0;
			_data._result.message = "upload data error";
			_callback(false,job);
		}
		else
		{
			var encryptKeyData = 
			{
				"encrypt_key" : encryptKey
			}

			client.post("setkey", encryptKeyData, function(err, res, body) 
			{		
			  	if(err) 
			  	{		  	
			  		console.log("-----------------upload key error(1)----------------");	
			    	console.log(err);				    	
			    	_data._result.result = 0;
					_data._result.message = "upload data error";
			  	}
			  	else
			  	{
			  		console.log(body);	
			  		if(body.result == 1)
			  		{
			  			console.log("-----------------upload key ok----------------");	
			  			_data._result.result = 1;
						_data._result.message = "upload data ok";	  			  			
			  		}
			  		else
			  		{		  			
			  			console.log("-----------------upload key error(2)----------------");	
			  			_data._result.result = 0;
						_data._result.message = "upload data error";
			  		}			  			
			  	}

			  	_callback(false,job);
			});	
		}
	},

	that = 
	{
		init: init,
		execute: execute
	};

	return that;
}