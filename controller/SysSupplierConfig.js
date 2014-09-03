var commands,
	storage,
	config;

module.exports =
{
	init : function(_commands,_storage,_config)
	{
		commands = _commands;
		storage = _storage;
		config = _config;

		return this;
	},

	basicGet : function(_req, _res)
	{
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigBasicGet", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	},

	basicPost : function(_req, _res)
	{
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigBasicPost", "progress": "+50"}],		
			],
			"data": 
			{
				"centerUrl":_req.body.center_url,
				"username":_req.body.username,
				"password":_req.body.password,
				"supplierStatus":_req.body.supplierStatus,
				"backupStatus":_req.body.backupStatus,
				"period":_req.body.period,
				"maxPartSize":_req.body.maxPartSize,
				//"uploadPath":_req.body.uploadPath
				"agentHeader":_req.session.loginData.agentHeader
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	},

	backUpGet : function(_req, _res)
	{
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigBackUpGet", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	},

	backUpPost : function(_req, _res)
	{
		var data = 
			{				
				"path":_req.body.path,				
				"real":_req.body.real,
				"virtual":_req.body.virtual	
			}

		if(_req.body.path == "backup")
		{
			data.enable =_req.body.enable,
			data.period = _req.body.period;
		}

		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigBackUpPost", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader,
				"data": data
			}

		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	},

	backupNow : function(_req, _res)
	{
		var data = 
		{				
			"backup_now":_req.body.backup_now
		}
	
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigBackUpNow", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader
			}

		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	},

	shareGet : function(_req, _res)
	{
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigShareGet", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	},

	sharePost : function(_req, _res)
	{
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigSharePost", "progress": "+50"}],		
			],
			"data": 
			{
				"downloadSpeedLimit":_req.body.download_speed_limit,
    	    	"registerDiskSpace":_req.body.registerDiskSpace
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
			config.reload();
		});
	},

	statusGet : function(_req, _res)
	{
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigStatusGet", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader,
				"url":_req.params[0]
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	},

	listLocalDir : function(_req, _res)
	{
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigListLocalDir", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader,
				"path":_req.params[0]
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	},

	keyGet : function(_req, _res)
	{	
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigKeyGet", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader,
				"path":_req.params[0]
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			var file = './iServStorage.key';
	 		_res.download(file,"iServStorage.key",function(err)
	 		{
	 			if(err)
	 			{
	 				console.log("err getKey");
	 				console.log(err);
	 				_res && _res.send(myCommand.getJobResult());
	 			}
	 			else
	 			{
	 				console.log("ok getKey");
	 			}		 			
	 		});		
		});
	},

	keyUpload : function(_req, _res)
	{
		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "sysSupplierConfigKeyUpload", "progress": "+50"}],		
			],
			"data": 
			{
				"agentHeader":_req.session.loginData.agentHeader,
				"key":_req.files
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			_res && _res.send(myCommand.getJobResult());
		});
	}
}