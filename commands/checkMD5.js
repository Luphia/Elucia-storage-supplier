/* ´ú¸Õ
[ input ]	
	_data = {
		"client_id":"1",
		"token":"asdfawer2q4aedf",
		"partition_file_name":"123.part1"
	}
[ output(callback) ]
	_data = {
		
	}		
*/	


module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	// ÀË¬d VM
	execute = function(_data, callBack){
		console.log("####### in function checkMD5 ######## ");
		var serverIP = _data._config.serverIP;
		// check token
		if(_data.checkResult == 0){
			_data.checkMD5 = 0;
			callBack(false, job);
			return;
		}

		// get real file path
		var writePath = _data.partition_file_path;
		writePath = _data.client_id + "/" + writePath;
		console.log(writePath);
		console.log("try to encode writePath");
		var encode_path = require("../modules/file").init(_data._config.uploadPath).pathEncode(writePath);
		console.log("encode_path: " + encode_path);
		
		var getMD5 = function(flag,data) {

			if(data != _data._result.data.md5){	
				var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
				require("../modules/log2Server.js").send(sendIP, _data.client_id, 2, "[checkMD5] check file md5 err: " + writePath, _data._config.publicIP);
				console.log("################");
				console.log("rece path: " + encode_path);
				console.log("real md5: " + data);
				console.log("rece md5: " + _data._result.data.md5);			
				console.log("Not Match");
				_data.checkResult = 0;
				_data.checkMD5 = 0;
			}else{
				console.log("Match");
				_data.checkResult = 1;
				_data.checkMD5 = 1;
			}
			
			callBack(false, job);
		}

		// get file md5
		var file_tmp = {
			"path":encode_path
		}
		
		require("../modules/file.js").init(_data._config.uploadPath).md5(file_tmp, getMD5);
				
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	