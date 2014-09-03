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
	// get: function(_req, _res) {
		// //var keyword = _req.params.keyword;
		// var client_id = _req.body.client_id, // 使用者帳號
			// token = _req.body.token,  // 使用者 token
			// partition_file_name = _req.body.partition_file_name, // 檔案名稱
			// rtdata = {};
			
		// var cCommand = require( '../modules/command.js' )
			// myCommand = new cCommand().init({
			// "progress": 0,
			// "todoList": [
				// [{"command": "checkToken", "progress": 50}],
				// [{"command": "returnDownloadResult", "progress": 50}]
			// ],
			// "data": {
				// "post": "test posting content",
				// "client_id":client_id,
				// "token":token,
				// "partition_file_name":partition_file_name
			// }
		// }, config);
		
		// var CID = commands.post(myCommand);

		// var cWorker = require("../roles/Worker");
		// var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			// setTimeout(function() {
				// rtdata = commands.get(CID).getOutput();
				// _res && _res.send(JSON.stringify(rtdata));
			// }, 300);
		// });	
	// },
	
	get: function(_req, _res) {
	//post: function(_req, _res) {
		//var client_id = _req.param("client_id");
		//var token = _req.param("token");
		 var client_id = _req.session.loginData.clientId;
		 var token = _req.session.loginData.token;		
		//var partition_file_name = _req.param("partition_file_name");
		var partition_file_path = _req.params[0];
		console.log(partition_file_path);
		var rtdata = {};
		
		// get file name
		var partition_file_name_arr = partition_file_path.split("\/");
		var partition_file_name = partition_file_name_arr[partition_file_name_arr.length - 1];
		console.log(partition_file_path);
		
		// get fileinfo
		var fileArr = {};
		for(var key in _req.files) 
		{
			fileArr[partition_file_path] = _req.files[key];
		}
		file_info = fileArr;
			
		console.log(file_info);
			
		var cCommand = require( '../modules/command.js' )
			myCommand = new cCommand().init({
			"progress": 0,
			"todoList": [
				[{"command": "checkToken", "progress": 25}],
				[{"command": "checkMD5", "progress": 25}],
				[{"command": "execDownload", "progress": 25}],
				[{"command": "returnDownloadResult", "progress": 25}]
			],
			"data": {
				"method": "get",
				"client_id":client_id,
				"token":token,
				"partition_file_name":partition_file_name,
				"partition_file_path":partition_file_path,
				//"res":_res
			}
		}, config);
		
		var CID = commands.post(myCommand);

		var cWorker = require("../roles/Worker");
		var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			// return data
			rtdata = commands.get(CID).getJobResult();
			// output data
			outputdata = commands.get(CID).getOutput();
			//console.log(rtdata.data.download_file_path);
			
			// 執行下載
			if(outputdata.data.checkResult == 1){
				console.log("###### in download process");
				try{
					outputdata.data.downloadResult = 1;
					var writePath = client_id + "/" + partition_file_path;
					_res.download_speed_limit = config.download_speed_limit;
					// get hex file name
					// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> try to get hex file name");
					// outputdata.data.file_hex_path = require("../modules/file").init(config.uploadPath).pathEncode(writePath);					
					// console.log(outputdata.data.file_hex_path);
					// exec download
					require("../modules/file").init(config.uploadPath).output(_res, writePath);
				}catch(e){
					outputdata.data.downloadResult = 1;
					console.log(e);
					_res && _res.send(JSON.stringify(rtdata));
				}
			}else{
				// 若失敗則回傳訊息
				_res && _res.send(JSON.stringify(rtdata));
			}

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

	// get: function(_req, _res) {
		// var rtdata = {};

		// var cCommand = require( '../modules/command.js' )
			// myCommand = new cCommand().init({
			// "progress": 0,
			// "todoList": [
				// [{"command": "getAppListByID", "progress": 100}]
			// ],
			// "data": {
				// "post": _req.session.loginData,
				// "application_id": _req.params.oid
			// }
		// }, config);
		// var CID = commands.post(myCommand);

		// var cWorker = require("../roles/Worker");
		// var worker = new cWorker().init(storage).assign(myCommand).execute(function() {
			// setTimeout(function() {
				// rtdata = commands.get(CID).getOutput();
				// _res && _res.send(JSON.stringify(rtdata));
			// }, 300);
		// });
	// },

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