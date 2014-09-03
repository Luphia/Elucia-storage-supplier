module.exports = function()
{
	var job
	,	myCallBack = function() {}
	,

	init = function(_job)
	{
		job = _job;
		return this;
	},

	execute = function(_data, _callBack)
	{
		console.log("####### in function execNodeRepair ######## ");
		var serverIP = _data._config.serverIP;
		console.log(_data.checkCenterIP);
		if(_data.checkCenterIP == 0){
			_callBack(false, job);
			return;
		}
		
		// get hex file name
		var writePath = _data.client_id + "/" + _data.partition_file_path;		
		_data.file_hex_path = require("../modules/file").init(_data._config.uploadPath).pathEncode(writePath);					
		console.log(_data.file_hex_path);		
		
		// get dispatch info
		//var url = "http://" + _data._config.serverIP + ":3000/";
		var url = "http://" + _data._config.serverIP + ":" + _data._config.communicationPort + "/";
		console.log(url);
		var file_path = "exec/" + "replication/" + _data.client_id + "/" +  _data.partition_file_path;
		console.log(file_path);
		request = require('request-json');
		var client = request.newClient(url);
		var dispatchPath = {};
		
		client.get(file_path, function(err, res, body) {
			if(err){
				var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
				require("../modules/log2Server.js").send(sendIP, _data.client_id, 2, "[execNodeRepair] get dispatch path err: " + file_path, _data._config.publicIP);
				console.log("get dispatch path err");
				_callBack(false, job);
			}else{
				//console.log(body);
				var result = JSON.parse(res.body);
				dispatchPath = result.data.to;
				console.log("############## dispatchPath");

				var isEmpty = 0;
				// dispatch file to supplier		
				for(var key in dispatchPath) {
					isEmpty = 1;
					console.log("send to : " + dispatchPath[key]);
					
					// var postFile = _data.file_info;
					// var postFileInfo = postFile[_data.partition_file_name];

					//curl -H "isRepair:1" 
					//--request POST -F file=@./test.txt --location http://10.10.20.96:3000/file/dirxx/test.abcccccccdefg

					// exec curl		
					var exec = require('child_process').exec,
						//token = "Authorization:" + "Bearer " + _data.token,
						isRepair = "isRepair:1",
						client_id = "client_id:" + _data.client_id,
						//path = postFileInfo.path,
						path = _data.file_hex_path,
						url = dispatchPath[key],
						url = url.replace(/\/file\//, "/repairFile/"),
						url = "'" + encodeURI(url) + "'";
						//url = "'" + url + "'";
					var command = "curl -H \'" + isRepair + "\' -H \'" + client_id + "\' --request POST -F file=@" + path + " --location " + url;
					console.log(command);
					exec(command, function (error, stdout, stderr){
						console.log(stdout.trim());
							
					});						
					
				}
				if(isEmpty == 0){
					console.log("### Get empty dispatchPath from Center");
				}				
				_callBack(false, job);
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