/*
 * @Function: 註冊 Config 資訊
 * @Author: mengtsang
 * @Date: 2014/03/14
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

	registerConfig: function(_req, _res) {
		var cCommand = require('../modules/command.js'),
			myCommand = new cCommand().init({
				"progress": 0,
				"todoList":
				[
					[{"command": "registerConfig", "progress": 100}]
				],
				"data":
				{
					path: _req.body.path,
					defaultPath: _req.body.defaultPath,
					publicIP: _req.body.publicIP,
					user: {
						username: _req.body.account,
						password: _req.body.password
					}
				}
			}, config);

			commands.post(myCommand); // for debug

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			rtdata = myCommand.getOutput();
			_res && _res.send(myCommand.getJobResult());
		});
	},

	registerNewAccount: function(_req, _res) {
		var clientId = _req.session.loginData.clientId,
			cCommand = require('../modules/command.js'),
			myCommand = new cCommand().init({
				"progress": 0,
				"todoList":
				[
					[{"command": "remoteRegisterClient", "progress": 100}]
				],
				"data":
				{
					"account": _req.body.account,
					"password": _req.body.password,
					"machineNumber": _req.body.machineNumber,
					"machineIp": _req.body.machineIp,
					"machineName": _req.body.machineName,
					"contact": _req.body.contact
				}
			}, config);

			commands.post(myCommand); // for debug

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			rtdata = myCommand.getOutput();
			_res && _res.send(myCommand.getJobResult());
		});
	},

	registerNewMachine: function(_req, _res) {
		var cCommand = require('../modules/command.js'),
			myCommand = new cCommand().init({
				"progress": 0,
				"todoList":
				[
					[{"command": "getHWInfo", "progress": 50}],
					[{"command": "remoteRegisterSupplier", "progress": 100}]
				],
				"data":
				{
					"account": _req.body.account,
					"clientId": _req.body.clientId
				}
			}, config);

			commands.post(myCommand); // for debug

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			rtdata = myCommand.getOutput();
			_res && _res.send(myCommand.getJobResult());
		});	
	},

	checkAccount: function(_req, _res) {
		var cCommand = require('../modules/command.js'),
			myCommand = new cCommand().init({
				"progress": 0,
				"todoList":
				[
					[{"command": "remoteCheckAccount", "progress": 100}]
				],
				"data":
				{
					"account": _req.params.account
				}
			}, config);

			commands.post(myCommand); // for debug

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			rtdata = myCommand.getOutput();
			_res && _res.send(myCommand.getJobResult());
		});
	},

	checkPassword : function(_req, _res) {
		var cCommand = require('../modules/command.js'),
			myCommand = new cCommand().init({
				"progress": 0,
				"todoList":
				[
					[{"command": "remoteCheckPassword", "progress": 100}]
				],
				"data":
				{
					"account": _req.params.account,
					"password": _req.params.password
				}
			}, config);

			commands.post(myCommand); // for debug

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			rtdata = myCommand.getOutput();
			_res && _res.send(myCommand.getJobResult());
		});
	}
}