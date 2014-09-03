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
		var request = require('request-json'),
		 	client = request.newClient('http://10.10.20.19:8888/'),
		 	postBasicData = 
		 	{
		 		"center_url":_data.centerUrl,
		 		"username":_data.username,
		 		"password":_data.password
		 	},
		 	postBackupData = 
		 	{
		 		"enable":_data.backupStatus,
		 		"period":_data.period,
		 		"max_part_size":_data.maxPartSize
		 	},
		 	nconf = require('nconf'),
		 	path = "./config/config.json";

		//set header
		for(var key in _data.agentHeader)
		{
			client.headers[key] = _data.agentHeader[key];
		}

		//basic setting
		var that = this;
		postBasic(_data,client,postBasicData,function()
		{
			//backup
			postBackup(_data,client,postBackupData,function()
			{
				nconf.argv().env().file({ file: path });
				nconf.set('enable',_data.supplierStatus);
		  		nconf.save(function(err)
		  		{
		  			if(err)
		  			{
		  				console.log(err);
		  			}

				 	//setSupplier setting
				 	setSupplierStatus(_data,function()
				 	{
				 		_callback(false,job);
			  		});
			  	});
			});
		});
	},

	postBasic = function(_data,_client,_postBasicData,_callBack)
	{
		_client.post('basic_setting', _postBasicData,function(err, res, body) 
		{
			if(err)
			{
				_data._result.result = 0;
				_data._result.message = "update basic setting error";
				console.log(err);
			}			
			else
			{
				console.log(body);
				if(body.result == 0)
				{	
					console.log("--------------basic error--------------");		
					_data._result.result = 0;
					_data._result.message = "update basic setting error";
				}
				else
				{
					console.log("--------------basic ok---------------");			
					_data._result.result = 1;
					_data._result.message = "update basic setting ok";
				}
				console.log(body);			
			}
			_callBack();
		});
	},

	postBackup = function(_data,_client,_postBackupData,_callBack)
	{
		_client.post('backup_setting', _postBackupData,function(err, res, body) 
		{
			if(err)
			{
				_data._result.result = 0;
				_data._result.message = "update backup setting error";
				console.log(err);
			}			
			else
			{
				if(body.result == 0)
				{
					console.log("--------------backup error---------------");
					_data._result.result = 0;
					_data._result.message = "update backup setting error";
				}
				else
				{
					console.log("--------------backup ok---------------");		
					_data._result.result = 1;
					_data._result.message = "update backup setting ok";
				}	
				console.log(body);				
			}
			_callBack();
		});
	},

	setSupplierStatus = function(_data,_callback)
	{
		var request = require('request-json'),
		 	client = request.newClient("http://"+_data._config.serverIP),
		 	data = 
		 	{
		 		"status":_data.supplierStatus
		 	}

		client.post('manage/supplier/supplierUpdateStatus', data,function(err, res, body) 
		{
			if(err)
			{
				console.log("--------------supplier Update Status error---------------");		
				_data._result.result = 0;
				_data._result.message = "update supplier error";
				console.log(err);
			}			
			else
			{
				if(body.result == 0)
				{	
					console.log("--------------supplier Update Status error---------------");				
					_data._result.result = 0;
					_data._result.message = "update supplier error";
				}
				else
				{
					console.log("--------------supplier Update Status ok---------------");	
					_data._result.result = 1;
					_data._result.message = "update supplier ok";
				}

			}
			_callback();
		});
	},

	that = 
	{
		init: init,
		postBackup:postBackup,
		postBasic:postBasic,
		setSupplierStatus:setSupplierStatus,
		execute: execute
	};

	return that;
}