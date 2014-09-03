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

	post: function(_req, _res) {
		var client_id = _req.session.loginData.clientId, // 使用者帳號
			token = _req.session.loginData.token,  // 使用者 token
			// client_id = _req.session.client_id, // 使用者帳號
			// token = _req.session.token,  // 使用者 token			
			file_info = _req.files; // 上傳檔案之資料
			partition_file_path = _req.params[0], // 檔案路徑
			rtdata = {};
			
		//console.log(file_info);
		
		// get file name
		var partition_file_name_arr = partition_file_path.split("\/");
		var partition_file_name = partition_file_name_arr[partition_file_name_arr.length - 1];
		console.log(partition_file_path);
		
		// get fileinfo
		var fileArr = {};
		for(var key in _req.files) 
		{
			fileArr[partition_file_name] = _req.files[key];
		}
		file_info = fileArr;
		
		console.log(file_info);
		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "checkToken", "progress": 33}],
				[{"command": "execUpload", "progress": 33}],
				[{"command": "returnUploadResult", "progress": 34}]
			],
			"data": {
				"method": "post",
				"client_id":client_id,
				"token":token,
				"partition_file_name":partition_file_name,
				"partition_file_path":partition_file_path,
				"file_info":file_info
			}
		}, config);
		
		var CID = commands.post(myCommand);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			setTimeout(function() {
				rtdata = commands.get(CID).getOutput();
				_res && _res.send(JSON.stringify(rtdata));
			}, 300);
		});
	},	
	
	delete: function(_req, _res) {
		var key = _req.params.oid,
			rtdata = {};

		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "deleteVM", "progress": 80}],
				[{"command": "deleteDomain", "progress": 90}],
				[{"command": "getResource", "progress": 95}],
				[{"command": ":write:storeKey:storeValue", "progresss": 100}]
			],
			"data": {
				"application_id": key,
				"domIP": config["domIP"],
				"domPath": config["domPath"],
				"domain": config["domain"],
				"storeKey": "usage",
				"storeValue": "savedata"
			}
		}, config);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute();

		var CID = commands.post(myCommand);

		rtdata = commands.get(CID).getOutput();
		_res && _res.send(JSON.stringify(rtdata));
	},

	list: function(_req, _res) {
		var rtdata = {};

		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"commandID": "xxx",
			"progress": 0,
			"todoList": [
				[{"command": "getAppList", "progress": 100}]
			],
			"data": {

			}
		}, config);
		var CID = commands.post(myCommand);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			setTimeout(function() {
				rtdata = commands.get(CID).getOutput();
				_res && _res.send(JSON.stringify(rtdata));
			}, 300);
		});

	},

	get: function(_req, _res) {
		var rtdata = {};

		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "getAppListByID", "progress": 100}]
			],
			"data": {
				"post": _req.session.loginData,
				"application_id": _req.params.oid
			}
		}, config);
		var CID = commands.post(myCommand);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			setTimeout(function() {
				rtdata = commands.get(CID).getOutput();
				_res && _res.send(JSON.stringify(rtdata));
			}, 300);
		});
	},

	loading: function(_req, _res) {
		var key = "AppLoading." + _req.params.oid,
			keeptime = new Date().valueOf() + (config.monitor.keep * 1000);
			tmpdata = {}
			rtdata = {
				"id": 0,
				"vm_oid": 0,
				"resource_id": 0,
				"compute_node": "",
				"disk_usage_size": 0,
				"traffic": 0,
				"rxbyte": 0,
				"txbyte": 0,
				"rxbyte_accu": 0,
				"rxbyte": 0,
				"txbyte_accu": 0,
				"txbyte": 0,
				"cpu_percent": 0,
				"UUID": "",
				"mem_percent": 0,
				"vm_status": "on",
				"vm_ip": "127.0.0.1",
				"vm_session_count": 0,
				"keepMonitor": 0,
				"lastRecord": 0
			};

		try {
			storage.post(key + ".keepMonitor", keeptime);

			tmpdata = storage.get(key);
			for(var key in tmpdata) {
				rtdata[key] = tmpdata[key];
			}
		}
		catch(e) {

		}
		finally {
			_res && _res.send(JSON.stringify(rtdata));
		}
	},

	on: function(_req, _res) {
		var rtdata = {};

		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "operateVM", "progress": 100}]
			],
			"data": {
				"application_id": _req.params.oid,
				"action":"ON",

				"account": _req.session.loginData.account,
				"token": _req.session.loginData.token,
				"tenantId": _req.session.loginData.tenantId,
				"tenantAccount": _req.session.loginData.account
			}
		}, config);
		var CID = commands.post(myCommand); //--

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			setTimeout(function() {
				rtdata = commands.get(CID).getOutput();
				_res && _res.send(JSON.stringify(rtdata));
			}, 300);
		});
	},

	off: function(_req, _res) {
		var rtdata = {};

		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "operateVM", "progress": 100}]
			],
			"data": {
				"application_id": _req.params.oid,
				"action":"OFF",

				"account": _req.session.loginData.account,
				"token": _req.session.loginData.token,
				"tenantId": _req.session.loginData.tenantId,
				"tenantAccount": _req.session.loginData.account
			}
		}, config);
		var CID = commands.post(myCommand); //--

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			setTimeout(function() {
				rtdata = commands.get(CID).getOutput();
				_res && _res.send(JSON.stringify(rtdata));
			}, 300);
		});
	},
	reset: function(_req, _res) {
		var rtdata = {};

		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "operateVM", "progress": 100}]
			],
			"data": {
				"application_id": _req.params.oid,
				"action":"RESET",

				"account": _req.session.loginData.account,
				"token": _req.session.loginData.token,
				"tenantId": _req.session.loginData.tenantId,
				"tenantAccount": _req.session.loginData.account
			}
		}, config);
		var CID = commands.post(myCommand); //--

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			setTimeout(function() {
				rtdata = commands.get(CID).getOutput();
				_res && _res.send(JSON.stringify(rtdata));
			}, 300);
		});
	}
}