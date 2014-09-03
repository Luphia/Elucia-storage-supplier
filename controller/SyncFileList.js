var commands,
	storage,
	config;

module.exports = {
	init: function(_commands, _storage, _config) {
		commands = _commands;
		storage = _storage;
		config = _config;
		return this;
	},

	parseURI: function(_uri) {
		return "resource." + _uri.split("/").join(".");
	},

	syncFile: function(_req, _res) {	
		var rtdata = {};
		var interval = config.gcInerval;
		console.log(interval);
		
		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "getNodeFileList", "progress": 25}],
				[{"command": "execSyncFileList", "progress": 25}],
				[{"command": "execCheckFileMD5", "progress": 25}],
				//[{"command": "execGarbageFileDelete", "progress": 25}],
				//[{"command": "returnFileNotExist", "progress": 25}],
				[{"command": ":again:" + interval, "progress": 0}] // repeat
			],
			"data": {
			}
		}, config);
		
		var CID = commands.post(myCommand);

		var cWorker = require("../roles/Worker");
		
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			setTimeout(function() {
				rtdata = commands.get(CID).getJobResult();
				_res && _res.send(JSON.stringify(rtdata));
			}, 300);
		});		
	},	




}