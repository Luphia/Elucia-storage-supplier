/*
*
*
*/

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

	parseURI: function(_uri) 
	{
		return "resource." + _uri.split("/").join(".");
	},

	login : function(_req, _res)
	{
		var username = _req.body.username,
			password = _req.body.password,
			rtdata = {};

		var cCommand = require( '../modules/command.js' );
		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "userAuth", "progress": "+20"}],
				[{"command": ":continue:_continue", "progress": "+0"}],
				[{"command": "remoteLogin", "progress": "+40"}]
//				[{"command": "agentLogin", "progress": "+40"}]
			],
			"data": 
			{
				"user": {
					"username": username,
                	"password": password
                },
				"ip": _req.headers['public-ip'] || _req.connection.remoteAddress
			}
		}, config);

		//send command
		commands.post(myCommand);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function(_data) 
		{
			//original data info
			loginData = myCommand.getJobResult();

			if(loginData.result == 1)
			{			
				_req.session.loginData = 
				{
					"agentHeader": loginData.data.agentHeader,
					"username": loginData.data.username,
					"clientId": loginData.data.clientId,
					"role": loginData.data.role,
					"token": loginData.data.token,
					"ip": _req.headers['public-ip'] || _req.connection.remoteAddress
				}
			}
			
			_res && _res.send(loginData);
		});
	},
	checkLogin: function(_req, _res) {
		var cResult = require("../modules/jobResult"),
			rtdata = new cResult();

		if(_req.session.loginData.clientId > -1 || _req.session.loginData.clientId == 0){
			rtdata.setResult(1);
			rtdata.setData({"token": _req.session.loginData.token});
		}
		else {
			rtdata.setResult(-1);
			rtdata.setMessage("not login");
		}

		_res && _res.send(rtdata.toJSON());
	},

	logout : function(_req, _res)
	{
		var rtdata = {};
		var cCommand = require( '../modules/command.js' );

		var myCommand = new cCommand().init(
		{
			"progress": 0,
			"todoList": 
			[
				[{"command": "remoteLogout", "progress": "50"}]
			],
			"data": 
			{
				"token":_req.session.loginData.token
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() 
		{
			delete _req.session.loginData;
			rtdata = myCommand.getOutput();
			_res && _res.send(myCommand.getJobResult());
		});
		
	},

	getUserConfig: function(_req, _res) {
		var clientId = _req.session.loginData.clientId,
			cCommand = require('../modules/command.js'),
			myCommand = new cCommand().init(
			{
				"progress": 0,
				"todoList": 
				[
					[{"command": "getUserConfig", "progress": "+50"}]
				],
				"data": 
				{
					"clientId": clientId,
					"user": _req.session.loginData
				}
			}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function()
		{
			rtdata = myCommand.getOutput();
			_res && _res.send(myCommand.getJobResult());
		});
	}
}