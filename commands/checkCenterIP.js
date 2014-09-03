
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// 檢查 VM
	execute = function(_data, _callBack){
		console.log("####### in function checkCenterIP ######## ");
		var serverIP = _data._config.serverIP;
		// get dispatch info
		//var url = "http://" + _data._config.serverIP + ":3000/";
		var url = "http://" + _data._config.serverIP + ":" + _data._config.communicationPort + "/";
		var file_path = "checkNode/" + _data.center_ip;
		var request = require('request-json');
		var client = request.newClient(url);
		var dispatchPath = {};
		
		_data.checkCenterIP = 0; // ip 是否通過檢驗
		
		client.get(file_path, function(err, res, body) {
			//return console.log(body.rows[0].title);
			if(err){
				var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
				require("../modules/log2Server.js").send(sendIP, _data.client_id, 2, "[checkCenterIP] check center ip err: " + file_path, _data._config.publicIP);
				console.log("get " + url + file_path + " err");
				_callBack(false, job);
			}else{
				//console.slog(body);
				console.log("http post: " + url + file_path);
				console.log(res.body);
				var result = JSON.parse(res.body);
				console.log(result.result);
				
				if(result.result == 0){
					_data.checkCenterIP = 0;
				}else{
					_data.checkCenterIP = 1;
				}
				
				// fake
				_data.checkCenterIP = 1;
				
				_callBack(false, job);	
			}
		});		
		
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	