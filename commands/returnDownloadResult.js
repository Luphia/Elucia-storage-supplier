
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	execute = function(_data, callBack){
		console.log("####### in function retunrnDownloadResult ######## ");
		//console.log(_data.partition_file_name);
		//var postFile = _data.file_info;
		//var postFileInfo = postFile[_data.partition_file_name];
		//console.log(postFileInfo);
		var partition_file_path = _data.partition_file_path;
		var client_id = _data.client_id;
		//var file_bytes = postFileInfo.size;
		//var file_content_type = postFileInfo.type;
		var serverIP = _data._config.serverIP;
		var md5 = _data.file_md5;	
		console.log("####### in function retunrnDownloadResult: 2 ######## ");
		// 先判斷 token 是否通過
		if(_data.check_result == 0){
			_data.uploadResult = 0;
			_data._result.result = 0;
			_data._result = {
				"result" : 0, 
				"message" : "check token fail: token fail", 
				"data" : ""
			};			
			callBack(false, job);
			return;
		}
		
		if(_data.checkResult == 1 && _data.downloadResult == 1){
			_data._result = {
				"result" : 1, 
				"message" : "download succ", 
				"data" : ""
			};

			// post usage size to center
			try{
				// get hex file name
				// var writePath = client_id + "/" + partition_file_path;					
				// var file_hex_path = require("../modules/file").init(config.uploadPath).pathEncode(writePath);
				
				// get file size
				var exec = require('child_process').exec;
				var execCmd = "cat " + _data.file_hex_path + "| wc -c";
				console.log(execCmd);
				
				exec(execCmd, function (error, stdout, stderr){
					_data.download_size = stdout.trim();
					
					var postData = function(data) {
						console.log(data);
					}
										
					// post download size to center					
					var params = {
						"clientId":client_id,
						"md5":_data.file_md5,
						"bytes":_data.download_size,
						"path":partition_file_path,
						"file_type":"",
						"traffic_type":"Download"
					}
					console.log(params);
					var sendIP = _data._config.serverIP + ":" + _data._config.communicationPort;
					var post = require( './postURL.js' );
					try{
						var actions = {
							"action": "execConfirm",
							"publicIP": _data._config.publicIP
						};
						post.posturl(actions, "", sendIP, params, postData);

					}catch(e){
						_data._result = {
							"result" : 0, 
							"message" : "download fail: post confirm msg to center err", 
							"data" : ""
						};
						callBack(e);
					}										
				});					
				
			}catch(e){
				outputdata.data.downloadResult = 0;
				console.log(e);
			}
			


			
		}else{
			_data._result = {
				"result" : 0, 
				"message" : "download fail: download file fail", 
				"data" : ""
			};		
		}
		var print = _data._result;
		console.log(print);
		callBack(false, job);
		
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	