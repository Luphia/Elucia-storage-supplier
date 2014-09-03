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

	collectInfo: function(_req, _res) {
		var rtdata = {};
		var interval = config.hwStoreInerval;
		console.log("########################");
		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "getHWInfo", "progress": 50}],
				[{"command": "storeHWInfo", "progress": 50}],
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

	get: function(_req, _res) {
		var rtdata = {};
		// var period_start = _req.body.period_start;
		// var period_end = _req.body.period_end;

		var period_start;	
		var period_end;
		var query_type = _req.param("query_type");

		// get real-time data or history data
		var query_cmd;
		if(query_type == "history"){
			query_cmd = "queryHWInfo";
			period_start = _req.param("period_start");	
			period_end = _req.param("period_end");			
		}else{
			query_cmd = "getHWInfo";
			period_start = "";	
			period_end = "";				
		}
		
		// console.log("$$$$$$$$$$");
		// console.log(period_start);
		// console.log(period_end);
		// console.log(query_type);
		// console.log(query_cmd);
		// console.log("$$$$$$$$$$");		
		
		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": query_cmd, "progress": 100}]
			],
			"data": {
				"period_start": period_start,
				"period_end": period_end,
			}
		}, config);
		
		var CID = commands.post(myCommand);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			setTimeout(function() {
				rtdata = commands.get(CID).getJobResult();
				//rtdata = commands.get(CID).getOutput();
				_res && _res.send(JSON.stringify(rtdata));
			}, 300);
		});
	},	
	

	sendHeartBeat: function(_req, _res) {	
		var rtdata = {};
		var client_id = "";
		//if(typeof(_req.session) != "undefined"){
			//client_id = _req.session.loginData.clientId;
		//}
		var interval = config.heartbeatInerval;
		console.log(interval);
		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "getHWInfo", "progress": 50}],
				[{"command": "sendHeartBeat", "progress": 50}],
				[{"command": ":again:" + interval, "progress": 0}] // repeat
			],
			"data": {
				"clientID":client_id
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