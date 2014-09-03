
module.exports = function() {
	var job,
	/** public function **/
	init = function(_job) {
		job = _job;
		return this;
	},

	execute = function(_data, callBack){
		console.log("####### in function returnUploadResult ######## ");
		console.log(_data.checkResult);
		console.log(_data.uploadResult);
		// 若 token 與 upload 皆成功則 result = 1
		if(_data.checkResult == 1 && _data.uploadResult == 1){
			_data.result = 1;
			//console.log(_data.result);
			
			// return confirm data
			var postFile = _data.file_info;
			var postFileInfo = postFile[_data.partition_file_name];
			var partition_file_path = _data.partition_file_path;
			var client_id = _data.client_id;
			var file_bytes = postFileInfo.size;
			var file_content_type = postFileInfo.type;
			var serverIP = _data._config.serverIP;
			var md5 = _data.file_md5;
			//console.log(postFile);
			//console.log(postFileInfo);
			
			
			// // get file md5
			// var getMD5 = function(flag,data) {
				// console.log(data);
				// md5 = data;
			// }
			// try{
				// require("../modules/file.js").init(_data._config.uploadPath).md5(postFileInfo, getMD5);
				// callBack(false, job);
			// }
			// catch(e){
				// callBack(e);	
			// }				
			//console.log(postFileInfo);
			// make params
			var params = {
				"clientId":client_id,
				"md5":md5,
				"bytes":file_bytes,
				"path":partition_file_path,
				"fileType":file_content_type,
				"traffic_type":"upload"
			}
			//console.log(params);
			// post to Center
			var postData = function(data) {
				var result = JSON.parse(data);
				console.log(result);
				if(result.result == 1){
					_data._result = {
						"result" : 1, 
						"message" : "upload succ", 
						"data" : ""
					};				
				}else{
					_data._result = {
						"result" : 0, 
						"message" : "upload fail: confirm data fail", 
						"data" : result.message
					};					
				}
			
				callBack(false, job);
			}	
			
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
					"message" : "upload fail: post confirm msg to center err", 
					"data" : ""
				};
				callBack(e);
			}					
			
			
		} else{
			_data.result = 0;
			_data._result = {
				"result" : 0, 
				"message" : "upload fail: checkToken fail", 
				"data" : ""
			};
			//console.log(_data.result);
			callBack(false, job);
		}	
	},
	
	
	that = {
		init: init,
		execute: execute
	};
	return that;		
}	
	